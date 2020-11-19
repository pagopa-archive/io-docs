---
title: 'Case study: garantire il diritto all''oblio'
created: '2020-11-13T16:43:39.086Z'
modified: '2020-11-14T09:47:45.393Z'
---

# Case study: garantire il diritto all'oblio

Quando progettiamo una nuova funzionalità per l'app IO, la più grande sfida che dobbiamo affrontare è quella di saper coniugare un'esperienza utente morbida con elevati requisiti di sicurezza, un'implementazione lineare con la complessità del contesto giuridico in cui IO si colloca rispetto al Cittadino. Questo richiede forte collaborazione tra sviluppatori, service designer, legali, esperti di sicurezza e di operations.

Questo processo interdisciplinare è stato messo particolarmente alla prova per recepire le norme del GDPR e integrarne i principi all'interno dell'app IO. In particolare, ai Cittadini deve essere garantito il _diritto all'oblio_, cioè deve essere rispettata la loro eventuale decisione di rimuovere i propri dati personali che vengono conservati dall'app IO.

In questo articolo vogliamo condividere le soluzioni tecniche messe in campo per garantire il diritto all'oblio del Cittadino. In particolare vorremmo condividere l'utilizzo di Azure Durable Functions, e di come abbiamo tratto veramente grande beneficio da questo strumento.


## Specifiche
L'implementazione che andremo a presentare è stata pensata per soddisfare i seguenti requisiti:
* Come Cittadino voglio poter richiedere la cancellazione dei miei dati.
* Come Cittadino voglio poter ritirare la precedente richiesta entro 7gg.
* Come DPO voglio che sia tenuta traccia di tutte le richieste del Cittadino e dello stato di lavorazione delle stesse.
* Come Cittadino voglio essere notificato dell'avvenuta cancellazione
* Come DPO voglio mantenere i dati del Cittadino per gestire eventuali contestazioni o contenziosi



## Implementazione
### Task
Elaborando i precendenti requisiti abbiamo ricavato questa lista di task puntuali:
* Esporre endpoint salvataggio della richiesta di cancellazione
* Esporre endpoint di annullamento della richiesta di cancellazione
* Attendere 7gg per un eventuale annullamento
* Backup dati utente in storage protetto
* Eliminare i dati utente
* Disiscrivere l'utente dai feed degli enti
* Inviare mail di completamento al cittadino

### Modellazione dei dati
Le informazioni delle richieste di cancellazione e dei suoi stati di lavorazione sono state modellate tramite la definizione `UserDataProcessing`. [Qui trovi la definizione completa](https://github.com/pagopa/io-functions-commons/blob/c46d77a5e5e8175d05d57dfc98cbac11c0661f7d/src/models/user_data_processing.ts#L43), ma ti basta sapere che:
* le richieste sono identificate dal codice fiscale del Cittadino e dal tipo di richiesta (`choice`, che può aver valore `DOWNLOAD` o `DELETE`);
* lo stato di lavorazione può essere `PENDING`, `WIP`, `ABORTED`, `FAILED` o `CLOSED`;
* i record non vengono aggiornati ma salvati sul database in modalità _append-only_. 

### Endpoint 
Abbiamo messo a disposizione delle API REST due endpoint dedicati:
* [richiedere la cancellazione](https://github.com/pagopa/io-functions-app/tree/597853ffbb3b0e1f8594592fe04b302cad5fdee5/UpsertUserDataProcessing);
* [annullare la precedente richesta](https://github.com/pagopa/io-functions-app/tree/597853ffbb3b0e1f8594592fe04b302cad5fdee5/AbortUserDataProcessing).

Sono due tipici handler HTTP REST di cui non approfondiremo le implementazioni.

### Workflow di cancellazione
> TODO: qui spiegazione in prosa del workflow

Qui entrano in gioco le Durable Functions. 
Durable Functions è un'estensione di Azure Functions che facilita lo sviluppo di workflow in cui si sovrappongo _long running job_, interazioni umane, timer e operazioni asincrone in generale. Per citare la documentazione ufficiale:
> Durable Functions è un'estensione di Funzioni di Azure che consente di scrivere funzioni con stato in un ambiente di calcolo serverless. L'estensione permette di definire flussi di lavoro con stato, scrivendo funzioni dell'agente di orchestrazione, ed entità con stato, scrivendo funzioni di entità tramite il modello di programmazione di Funzioni di Azure. Dietro le quinte, l'estensione gestisce automaticamente lo stato, i checkpoint e i riavvii, consentendo di concentrarsi sulla logica di business.

Per maggiori dettagli rimandiamo alla [documentazione di Azure Durable Functions](https://docs.microsoft.com/it-it/azure/azure-functions/durable/durable-functions-overview).

Noi del team di IO facciamo largo uso di queste funzionalità e in particolare due tipo di funzioni chiamate _Orchestrator_ e _Activity_. [La documentazione di Azure](https://docs.microsoft.com/it-it/azure/azure-functions/durable/durable-functions-types-features-overview#orchestrator-functions) è il miglior inizio per capire questi due strumenti, volendoli però riassumere potremmo dire che:
* le Activity Functions sono dei singoli job, solitamente asincroni (letture/scritture su database, storage, interrogazione di API di terze parti, etc);
* le Orchestrator Functions sono delle istanze che mantengono un proprio stato e possono essere messe in pausa e riattivate.

Come intuibile dal nome, tramite gli Orchestrator è possibile coordinare l'esecuzione di diverse Activity. L'implementazione in Javascript è fatta utilizzando le [Generator functions](https://developer.mozilla.org/it/docs/Web/JavaScript/Guida/Iteratori_e_generatori), oggetti che meglio si addicono ad uno stile di programmazione imperativo anzichè funzionale come invece saremmo portati a [preferire](https://pagopa.github.io/io-docs/io-handbook/development-guidelines#general-guidelines); compromesso che però accettiamo di buon grado vista la potenza e la versalità dello che questo strumento ci offre.

[Questo il workflow di cancellazione](https://github.com/pagopa/io-functions-admin/blob/fa05bc96b6a756d4b8f14769a59b556d0709eb7a/UserDataDeleteOrchestrator/handler.ts#L320) implementato tramite una Orchestrator function. É una funziona abbastanza lunga (180 righe), ma sorprendentemente lineare in considerazione 


#### focus: gestione wait/interrupt
> TODO: spiegazione dettagliata del meccanismo di wait/interrupt

#### focus: controllo concorrenza con richiesta di download
> TODO: spiegazione dettagliata del meccanismo di controllo concorrenza con richiesta di download

### Azionamento del workflow
> TODO: giusto due parole sul trigger di attivazione del workflow

## Test
### Strategia
> TODO: mettere in prosa la seguente lista

* vogliamo eseguire unit test sul workflow: fornire un input e valutare l'output
* dipendenze orchestrator: esplicite (valori temporali) implicite (activity)
* separazione index/handler: i parametri temporali sono gestiti come dependency injection, quindi possiamo testare sync

### Mocking
> TODO: mettere in prosa la seguente lista

* mock delle activity: happy path di default
* consume dell'orchestrator

### Example
> TODO: mettere in prosa la seguente lista

* esempio di test
