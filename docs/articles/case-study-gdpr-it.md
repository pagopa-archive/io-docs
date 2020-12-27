---
title: "Case study: garantire il diritto all'oblio"
created: "2020-11-13T16:43:39.086Z"
modified: "2020-11-14T09:47:45.393Z"
---

# Case study: garantire il diritto all'oblio

Quando progettiamo una nuova funzionalità per l'app IO, tra le sfide che
dobbiamo affrontare primeggia la necessità di conciliare un'esperienza utente
morbida con elevati requisiti di sicurezza e privacy. La complessità
dell'implementazione si estende di pari passo a quella imposta dal contesto
giuridico in cui il progetto si colloca; un percorso che richiede l'assidua
collaborazione tra sviluppatori, service designer, legali, esperti di sicurezza
e di operation.

Tale processo interdisciplinare è stato messo alla prova dall'esigenza di
recepire le norme del GDPR e incorporarne i requisiti nell'app: ai Cittadini va
garantito - tra gli altri - il _diritto all'oblio_, ovvero il tassativo rispetto
della volontà di rimuovere i propri dati personali, laddove esplicitamente
espressa. Allo stato dell'arte, tali dati sono conservati negli archivi della
piattaforma di backend che realizza le funzionalità di IO.

In questo articolo vogliamo condividere le soluzioni tecniche messe in campo per
garantire il diritto all'oblio del Cittadino. In particolare vorremmo
condividere l'utilizzo di Azure Durable Functions, e di come abbiamo tratto un
rilevante beneficio da questo strumento in termini di produttività, possibilità
di monitoraggio, performance e stabilità del sistema.

## Specifiche

L'implementazione che andremo a presentare è stata pensata per soddisfare i
seguenti requisiti:

- Come Cittadino voglio poter richiedere la cancellazione dei miei dati;
- Come Cittadino voglio poter ritirare la precedente richiesta entro 7 giorni;
- Come DPO (Data Processing Officer) voglio che sia tenuta traccia di tutte le
  richieste del Cittadino e dello stato di elaborazione delle stesse;
- Come Cittadino voglio essere avvisato dell'avvenuta cancellazione;
- Come DPO voglio mantenere i dati del Cittadino per gestire eventuali
  contestazioni o contenziosi.

## Implementazione

### Task

Elaborando i requisiti abbiamo ricavato una lista di funzionalità:

- Esporre un endpoint API per il salvataggio della richiesta di cancellazione;
- Esporre un endpoint API per l'annullamento della richiesta di cancellazione;
- Attendere 7 giorni per un eventuale annullamento dal momento della richiesta;
- Memorizzare, prima dell'eliminazione, un backup dei dati dell'utente in uno storage protetto;
- Eliminare i dati utente dagli archivi in produzione;
- Disiscrivere l'utente dai feed delle sottoscrizioni ai servizi esposti dagli enti;
- Inviare una mail di conferma completamento della procedura di eliminazione al cittadino che ne ha fatto richiesta.

### Modellazione dei dati

Le informazioni delle richieste di cancellazione e dei suoi stati di lavorazione
sono state modellate tramite [l'entità `UserDataProcessing`](https://github.com/pagopa/io-functions-commons/blob/c46d77a5e5e8175d05d57dfc98cbac11c0661f7d/src/models/user_data_processing.ts#L43):

- le richieste (UserDataProcessing) sono identificate dal codice fiscale del Cittadino e dal tipo
  (`choice`, che può aver valore `DOWNLOAD` o `DELETE`);
- lo stato di lavorazione può essere `PENDING`, `WIP`, `ABORTED`, `FAILED` o
  `CLOSED`;
- i record non vengono aggiornati, ma salvati sul database in modalità
  _append-only_ in modo da garantire una storicizzazione immutabile delle richieste.

### Endpoint

Inizialmente abbiamo implementato gli endpoint dedicati (API REST):

- [richiedere la
  cancellazione](https://github.com/pagopa/io-functions-app/tree/597853ffbb3b0e1f8594592fe04b302cad5fdee5/UpsertUserDataProcessing);
- [annullare la precedente
  richesta](https://github.com/pagopa/io-functions-app/tree/597853ffbb3b0e1f8594592fe04b302cad5fdee5/AbortUserDataProcessing).

### Workflow di cancellazione

Qui entrano in gioco le Durable Functions. Durable Functions è un'estensione di
Azure Functions che facilita lo sviluppo di workflow in cui si sovrappongo _long
running job_, interazioni umane, timer e operazioni asincrone in generale. Per
citare la documentazione ufficiale:

> Durable Functions è un'estensione di Funzioni di Azure che consente di
> scrivere funzioni con stato in un ambiente di calcolo serverless. L'estensione
> permette di definire flussi di lavoro con stato, scrivendo funzioni
> dell'agente di orchestrazione, ed entità con stato, scrivendo funzioni di
> entità tramite il modello di programmazione di Funzioni di Azure. Dietro le
> quinte, l'estensione gestisce automaticamente lo stato, i checkpoint e i
> riavvii, consentendo di concentrarsi sulla logica di business.

Per maggiori dettagli rimandiamo alla [documentazione di Azure Durable
Functions](https://docs.microsoft.com/it-it/azure/azure-functions/durable/durable-functions-overview).

Nell'implementazione del backend di IO facciamo largo uso di queste funzionalità e in particolare
due tipologie di funzioni chiamate _Orchestrator_ e _Activity_. [La
documentazione di
Azure](https://docs.microsoft.com/it-it/azure/azure-functions/durable/durable-functions-types-features-overview#orchestrator-functions)
è il miglior inizio per capire questi due strumenti, volendoli però riassumere
potremmo dire che:

- le Activity Functions sono dei singoli job, solitamente asincroni
  (letture/scritture su database, storage, interrogazione di API di terze parti,
  etc);
- le Orchestrator Functions sono delle istanze che mantengono un proprio stato e
  possono essere messe in pausa e riattivate.

Tramite gli Orchestrator è possibile coordinare l'esecuzione di diverse
Activity. L'implementazione in Javascript è fatta utilizzando le [Generator
functions](https://developer.mozilla.org/it/docs/Web/JavaScript/Guida/Iteratori_e_generatori),
oggetti che meglio si addicono ad uno stile di programmazione imperativo anzichè
funzionale come invece saremmo portati a
[preferire](https://pagopa.github.io/io-docs/io-handbook/development-guidelines#general-guidelines);
compromesso che però accettiamo di buon grado vista la potenza e la versalità
che questo strumento ci mette a disposizione.

[Questo il workflow di
cancellazione](https://github.com/pagopa/io-functions-admin/blob/fa05bc96b6a756d4b8f14769a59b556d0709eb7a/UserDataDeleteOrchestrator/handler.ts#L320)
implementato tramite una Orchestrator function. É una funzione abbastanza lunga
(180 righe), ma sorprendentemente lineare in considerazione della logica articolata che implementa.
Come detto, lo stile è imperativo e le istruzioni vengono eseguite una dopo l'altra a meno di errori, che vengono gestiti nel `catch` finale. Ci sono però alcuni passaggi che meritano un approfondimento, di seguito proviamo a raccontarli.

#### Focus: gestione "periodo di grazia" per eliminazione contenuti utente

Il requisito

> Come Cittadino voglio poter ritirare la precedente richiesta entro 7 giorni;

potrebbe essere tradotto in un algoritmo del tipo:

```
PER un periodo di 7 giorni:
  SE il cittadino chiede di annullare la cancellazione:
    > annulla la cancellazione
    > termina il workflow
  ALTRIMENTI
    > continua ad aspettare

> cancella i dati del cittadino
```

Non è ovviamente pensabile implementare un ciclo della durata di 7 giorni. Un'alternativa classica in questi casi è usare un algoritmo di _polling_ che esegua il controllo ad intervalli di tempo ponderati, abbastanza brevi da non aggiungere ritardi di esecuzione e allo stesso tempo abbastanza grandi da non saturare le risorse del sistema.

Sfruttando la natura stessa delle Orchestrator function, cioè poter essere interrotte e riattivate a piacimento, abbiamo invece risolto il problema in meniera decisamente più efficiente ed elegante.
In pratica, interrompiamo l'esecuzione del workflow e decidiamo che possa essere riattivata solo in due casi: se il cittadino ci richiede l'annullamento o se sono passati 7 giorni. Alla riattivazione, controlliamo quale sia l'evento scatenante e in base a questo decidiamo con quale azione proseguire.

In pseudo-codice possiamo descriverlo così:

```
ATTENDI riattivazione CON ["richiesto annullamento" OPPURE "passati 7 giorni"]

SE riattivazione = "passati 7 giorni"
  > cancella i dati del cittadino
ALTRIMENTI
  > annulla la cancellazione
```

La codifica in Typescript usando la sdk fornita da Azure è abbastanza fedele allo pseudo-codice:

```ts
// timer a 7 giorni
const intervalExpiredEvent = context.df.createTimer(
  addDays(context.df.currentUtcDateTime, 7)
);
// listener per evento di annullamento
const canceledRequestEvent = context.df.waitForExternalEvent(ABORT_EVENT);

// il primo dei due eventi che succede
const triggeredEvent = yield context.df.Task.any([
  intervalExpiredEvent,
  canceledRequestEvent,
]);

if (triggeredEvent === intervalExpiredEvent) {
  // cancella i dati del cittadino
} else {
  // annulla la cancellazione
}
```

La parte interessante è il metodo `Task.any`: il metodo ritorna la prima attività conclusa tra quelle passate in input, nel caso specifico, l'evento di expire o la richiesta di cancellazione. L'implemetazione finale è consultabile in [questo punto](https://github.com/pagopa/io-functions-admin/blob/924a7ed8371681ff0fc8b4b2869695d0808ac9bf/UserDataDeleteOrchestrator%2Fhandler.ts#L366) del workflow.

#### focus: controllo concorrenza con richiesta di download

Non ne abbiamo parlato in questo articolo, ma un cittadino può anche richedere semplicemente l'accesso ai suoi dati senza essere cancellato da IO; tale diritto si concretizza nella creazione di un archivio compresso contenente i dati del cittadino al momento conservati dal nostro backend. Anche questa operazione avviene tramite un workflow asincrono implementato tramite un'apposita [Orchestrator function](https://github.com/pagopa/io-functions-admin/blob/a1bb2b16edff9c04bd86da6cffe405b097ddacaf/UserDataDownloadOrchestrator%2Fhandler.ts).

Cosa succede se un cittadino sta per essere cancellato da IO, ma ha una richiesta di accesso ai dati attualmente in elaborazione? Questo caso di concorrenza ha fatto emergere il seguente requisito:

> Se una richiesta di accesso ai dati è in elaborazione, la cancellazione viene posticipata

Contrariamente a quanto avvenuto con il caso precendente, per questo scenario abbiamo implementato un _polling_ temporizzato, controllando ad intervalli regolari che la concorrenza di fosse risolta.

Forti del fatto che questa casistica fosse abbastanza rara e che l'intervallo fosse dell'ordine delle ore, abbiamo preferito fosse lo stesso workflow di cancellazione a risolvere la concorrenza, senza dipendere dalla presenza di eventi esterni e rendendo più semplice il monitoraggio e l'eventuale troubleshooting.

L'algoritmo in pseudo-codice:

```
MENTRE il cittadino ha un download in corso:
  ASPETTA 1 ora

> cancella i dati del cittadino
```

e la sua codifica in Typescript:

```ts
while (
  yield* hasPendingDownload(
    context,
    currentUserDataProcessing.fiscalCode
  )
) {
  yield context.df.createTimer(
    addHours(context.df.currentUtcDateTime, 1)
  );
}
```

Anche in questo caso, l'implementazione finale è consultabile nel [workflow attualmente in produzione](https://github.com/pagopa/io-functions-admin/blob/924a7ed8371681ff0fc8b4b2869695d0808ac9bf/UserDataDeleteOrchestrator%2Fhandler.ts#L390).

### Azionamento del workflow

Piccola menzione per il meccanismo incaricato di azionare il workflow di cui abbiamo parlato. Attualmente viene gestito tramite un trigger sulla collection `user-data-collection` del database CosmosDB, richiamato ad ogni documento inserito. Guardando [l'implementazione della funzione](https://github.com/pagopa/io-functions-admin/blob/dad714275eb0bf505916ce375d390bbfe6360582/UserDataProcessingTrigger%2Findex.ts#L1), ci si accorge che per ogni documento si decide se:

* [avviare un workflow di accesso ai dati](https://github.com/pagopa/io-functions-admin/blob/dad714275eb0bf505916ce375d390bbfe6360582/UserDataProcessingTrigger%2Findex.ts#L116)
* [avviare un workflow di cancellazione](https://github.com/pagopa/io-functions-admin/blob/dad714275eb0bf505916ce375d390bbfe6360582/UserDataProcessingTrigger%2Findex.ts#L133)
* [emettere l'evento di annullamento della cancellazione](https://github.com/pagopa/io-functions-admin/blob/dad714275eb0bf505916ce375d390bbfe6360582/UserDataProcessingTrigger%2Findex.ts#L149)

o semplicemente ignorarlo, a seconda dei casi. 

Questo trigger è stata una soluzione molto semplice da implementare grazie al [_binding_](https://github.com/pagopa/io-functions-admin/blob/a1bb2b16edff9c04bd86da6cffe405b097ddacaf/UserDataProcessingTrigger%2Ffunction.json#L3) offerto dal runtime Azure Functions. Potremmo pensare di sostituirlo con un sistema più sofisticato, soprattutto considerando che non è compatibile con in nostro processo di _blue/green deployment_, tuttavia per il momento si sta comportando molto bene.

## Test

### Strategia

> TODO: mettere in prosa la seguente lista

- vogliamo eseguire unit test sul workflow: fornire un input e valutare l'output
- dipendenze orchestrator: esplicite (valori temporali) implicite (activity)
- separazione index/handler: i parametri temporali sono gestiti come dependency
  injection, quindi possiamo testare sync

### Mocking

> TODO: mettere in prosa la seguente lista

- mock delle activity: happy path di default
- consume dell'orchestrator

### Example

> TODO: mettere in prosa la seguente lista

- esempio di test

```

```

```
