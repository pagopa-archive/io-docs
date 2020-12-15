---
title: How to setup CI/CD for a project
---

## Context 

This guide is intended for all tech team members that need to setup CI/CD automated pipelines for a project using [Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops).

## Prerequisites

* You have access to [Azure DevOps](https://dev.azure.com/pagopa-io/) portal.
* A project linked to your application's codebase exists on Azure Devops.

## Pipeline design tips

* Try to create one pipeline per scenario (code review, deploy, backup, etc) in order to keep each pipeline simple and linear
* Place all the resources involved in the pipeline execution in a folder `.devops`.
* Group common tasks into templates to be shared between jobs of the same pipeline or of different pipelines.
* We have [a collection of common templates](https://github.com/pagopa/azure-pipeline-templates), use them and contribute back.

## Create a pipeline

* On the application repo, create a yaml file in `.devops` folder; name it `pagopa.{project-name}.{pipeline-type}.yml` (example: `pagopa.io-docs.code-review.yml`); commit and push.
* On the Azure Devops project, select **_New Pipeline > Github > select repository > Existing Azure Pipelines YAML file_**; select the file you just created and press `Continue`.
* Set pipeline variables, if needed.
* Rename the pipeline and press `save`.

## Setup Github connection

In order to connect the pipeline to a Github repository, we must set a `Service Connection` in the project settings. 

### Connections to read from the repository 

When creating the first pipeline of a project, a default service connection is created. This connection is of type `GitHub (using azure pipelines app)`, meaning it is linked to the `Azure Pipelines` Github App installed in the application repository; such app is installed along with the first pipeline, too (check _settings/installations_ page on the repository). 
This type of service connection is good enough for the pipeline to checkout code, perform checks and have results to be displayed directly in a pull request thread. 

### Connections to push into the repository

If your pipeline needs to push into the repository (example: create a commit or a tag), you need to set up a service connection of type `GitHub (using oauth)`. This kind of connection is related to a specific Github user and inherits its priviledges over the target repository. 
To set up such service connection, go to **_Project settings > Service connections > New service connection_**. In the creation panel, do:
1. Select **_Github_**.
1. Authentication method: `Grant authorization`.
1. OAuth configuration: `AzurePipelines`.
1. Click **_Authorize_** and grant the app via the OAuth protocol. Be careful to be logged *as the user you want to associate the connection with*.
1. Review the service connection name.
1. Click **_Save_**.

To associate this service connection to a pipeline:
1. Open the pipeline's edit page.
1. Open the **_Triggers_** menu.
1. Go to **_YAML > Get sources_**.
1. Select the newly create service connection.
1. Click **_Save_**.
