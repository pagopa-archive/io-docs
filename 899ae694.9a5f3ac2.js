(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{112:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/run_pipeline-97c0e530ebcaafef20f4c14e4b2c1f92.png"},113:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/pipeline_status-e0934649eb5ff719a5f2a99e7503aaae.png"},114:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/Pipeline_status_check-fa28435230b00e1f8b01d302db368be5.png"},115:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/pipeline_stages_new_release-0a5160d05b45289ae1b97d02663c4505.png"},116:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/activity_log1-9f5a4c287cb3c7e635262ea9caf9650b.png"},117:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/activity_log2-4a763922d6ece322cbfdcfcbfefc7b3a.png"},118:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/activity_log3-07b22c6b357aa60e3d422d6770c33079.png"},119:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/app_insights-b68ffda568f9c5eebbedcbd545ba9a76.png"},120:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/az-login-5fa9186385901f64dcc8fc77873116f8.png"},121:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/az-log-tail-03cfc5e23b517fed1a1cb0cff53accde.png"},65:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return p}));var a=n(2),o=n(6),i=(n(0),n(77)),r={title:"How to deploy"},c={unversionedId:"io-handbook/how-to-deploy",id:"io-handbook/how-to-deploy",isDocsHomePage:!1,title:"How to deploy",description:"Context",source:"@site/docs/io-handbook/how-to-deploy.md",slug:"/io-handbook/how-to-deploy",permalink:"/io-docs/io-handbook/how-to-deploy",editUrl:"https://github.com/pagopa/io-docs/edit/main/docs/io-handbook/how-to-deploy.md",version:"current",sidebar:"docs",previous:{title:"How to setup CI/CD for a project",permalink:"/io-docs/io-handbook/cicd-setup"},next:{title:"Typescript compiler issues",permalink:"/io-docs/io-handbook/typescript-compiler-issues"}},l=[{value:"Context",id:"context",children:[]},{value:"Prerequisites",id:"prerequisites",children:[]},{value:"Lookup code changes",id:"lookup-code-changes",children:[]},{value:"Run the pipeline",id:"run-the-pipeline",children:[{value:"Scenario: deploy new features",id:"scenario-deploy-new-features",children:[]},{value:"Scenario: deploy an existing version",id:"scenario-deploy-an-existing-version",children:[]}]},{value:"Monitor production logs",id:"monitor-production-logs",children:[{value:"Check the activity log",id:"check-the-activity-log",children:[]},{value:"Check Application Insights logs",id:"check-application-insights-logs",children:[]}]},{value:"Test in production environment",id:"test-in-production-environment",children:[]}],s={rightToc:l};function p(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"context"},"Context"),Object(i.b)("p",null,"This guide is intended for all tech team members that need to deploy into production\nrunning the pipelines through the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://dev.azure.com/pagopa-io/"}),"Azure DevOps")," portal."),Object(i.b)("p",null,"Ask for permession in #dev_io if you are willing to deploy some artifacts\n(ie. backend, functions) into the IO platform production environment."),Object(i.b)("h2",{id:"prerequisites"},"Prerequisites"),Object(i.b)("p",null,"Please check the following requirements:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"https://docs.microsoft.com/it-it/cli/azure/install-azure-cli"}),"Azure CLI")," is installed locally"),Object(i.b)("li",{parentName:"ul"},"You have the permission to run a pipeline on Azure DevOps"),Object(i.b)("li",{parentName:"ul"},"You have access to production services on the ",Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"https://portal.azure.com/#home"}),"Azure Portal")),Object(i.b)("li",{parentName:"ul"},"You can create new releases on GitHub")),Object(i.b)("p",null,"We are going to take the deployment of ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/pagopa/io-functions-assets"}),"io-functions-assets"),"\nas an example, assuming that we want to deploy a new version of the code in the production environment."),Object(i.b)("h2",{id:"lookup-code-changes"},"Lookup code changes"),Object(i.b)("p",null,"The first question you should answer is: ",Object(i.b)("strong",{parentName:"p"},"What changes needs to be deployed yet?")),Object(i.b)("p",null,"To answer this question we have implemented a Slack command:\nrun ",Object(i.b)("inlineCode",{parentName:"p"},"/iodeploy")," into any Slack channel to see how many changes are waiting to be deployed for your target project\n(namely: how many commits have been merged into the ",Object(i.b)("inlineCode",{parentName:"p"},"master")," branch since the latest version was released).\nFor each project you'll get a link to the GitHub code diff between the release candidate (HEAD)\nand the latest version released."),Object(i.b)("h2",{id:"run-the-pipeline"},"Run the pipeline"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Navigate to the ",Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"https://dev.azure.com/pagopa-io/"}),"Azure DevOps")," portal"),Object(i.b)("li",{parentName:"ol"},"Click on ",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"io-functions-assets")),"' s project"),Object(i.b)("li",{parentName:"ol"},"Go to ",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"Pipelines"))," and select the deploy pipeline from list (i.e ",Object(i.b)("em",{parentName:"li"},"pagopa.io-functions-assets.deploy"),")"),Object(i.b)("li",{parentName:"ol"},"Click on ",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"Run Pipeline"))," button, you should see a right bar menu ",Object(i.b)("img",{alt:"Run pipeline",src:n(112).default})),Object(i.b)("li",{parentName:"ol"},"Check the options and value them according to the scenario you are in (see below); when ready, press the ",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"Run"))," button"),Object(i.b)("li",{parentName:"ol"},"Monitor the job status on the pipeline jobs detail pages: ",Object(i.b)("img",{alt:"Pipeline status",src:n(113).default})," ",Object(i.b)("img",{alt:"Pipeline Job check",src:n(114).default}))),Object(i.b)("p",null,"The deploy pipeline is configured to creare a release itself, so no previous operations are needed in order to deploy a new version of the application."),Object(i.b)("p",null,"A common deploy pipeline will look like the following:\n",Object(i.b)("img",{alt:"Pipeline stages",src:n(115).default})),Object(i.b)("h3",{id:"scenario-deploy-new-features"},"Scenario: deploy new features"),Object(i.b)("p",null,"The most common case: new code is added to ",Object(i.b)("inlineCode",{parentName:"p"},"master")," branch and you want to ship it. On the pipeline option screen, do the following:"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Select ",Object(i.b)("inlineCode",{parentName:"li"},"master")," as base ",Object(i.b)("inlineCode",{parentName:"li"},"branch/tag")),Object(i.b)("li",{parentName:"ol"},"Choose between ",Object(i.b)("inlineCode",{parentName:"li"},"major"),", ",Object(i.b)("inlineCode",{parentName:"li"},"minor")," or ",Object(i.b)("inlineCode",{parentName:"li"},"patch")," depending on the kind of changes introduced; application version will be bumped accordingly "),Object(i.b)("li",{parentName:"ol"},"Leave stages untouched")),Object(i.b)("p",null,"The pipeline will bump the application version, create a new release on project's Github page, build and deploy the application using a ",Object(i.b)("em",{parentName:"p"},"staging")," slot to have a warm start."),Object(i.b)("h3",{id:"scenario-deploy-an-existing-version"},"Scenario: deploy an existing version"),Object(i.b)("p",null,"This scenario happens when it is needed to roll back the application to a previous version (or you want to retry a failed deploy without creating a new release). On the pipeline option screen, do the following:"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Select ",Object(i.b)("inlineCode",{parentName:"li"},"refs/tags/v{VERSION}-RELEASE")," as base ",Object(i.b)("inlineCode",{parentName:"li"},"branch/tag"),", where ",Object(i.b)("inlineCode",{parentName:"li"},"{VERSION}")," is the semver number to reference code to."),Object(i.b)("li",{parentName:"ol"},"Ignore the choice between ",Object(i.b)("inlineCode",{parentName:"li"},"major"),", ",Object(i.b)("inlineCode",{parentName:"li"},"minor")," or ",Object(i.b)("inlineCode",{parentName:"li"},"patch"),", as no release will be created."),Object(i.b)("li",{parentName:"ol"},"Leave stages untouched.")),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"Release")," stage will be executed successufully anyway, but no release will be created. The application is then built and deployrd using a ",Object(i.b)("em",{parentName:"p"},"staging")," slot to have a warm start."),Object(i.b)("h2",{id:"monitor-production-logs"},"Monitor production logs"),Object(i.b)("p",null,"While the pipeline is running, and after the code has reached production,\nmonitor the production logs to lookup any error that may have been caused by the deploy."),Object(i.b)("p",null,"You must be logged in into the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://portal.azure.com/#home"}),"Azure Portal"),"\nand have the right to access Application Insights and the service you're deploying to."),Object(i.b)("h3",{id:"check-the-activity-log"},"Check the activity log"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Search for the service you are deploying to (in this case ",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"io-p-fn3-assets")),")"),Object(i.b)("li",{parentName:"ol"},"Select ",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"Activity Log"))," and take care about the swap operations (from staging to production)")),Object(i.b)("p",null,Object(i.b)("img",{alt:"activity Log 1",src:n(116).default})),Object(i.b)("p",null,Object(i.b)("img",{alt:"activity log 2",src:n(117).default})),Object(i.b)("p",null,Object(i.b)("img",{alt:"activity log 3",src:n(118).default})),Object(i.b)("h3",{id:"check-application-insights-logs"},"Check Application Insights logs"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Search for Application Insights (",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"io-p-ai-common")),")"),Object(i.b)("li",{parentName:"ol"},"Open the ",Object(i.b)("strong",{parentName:"li"},Object(i.b)("em",{parentName:"strong"},"Failures"))," section (left menu) and check if there are error spikes after the slots are swapped (from staging to production)")),Object(i.b)("p",null,Object(i.b)("img",{alt:"app insights",src:n(119).default})),Object(i.b)("h4",{id:"check-the-application-logs"},"Check the application logs"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Open a terminal and type ",Object(i.b)("inlineCode",{parentName:"li"},"az login")," ",Object(i.b)("img",{alt:"az login",src:n(120).default})),Object(i.b)("li",{parentName:"ol"},"Type ",Object(i.b)("inlineCode",{parentName:"li"},"az webapp log tail --resource-group io-p-rg-internal --name io-p-fn3-assets")," and check if there are relevant errors")),Object(i.b)("p",null,Object(i.b)("img",{alt:"az webapp tail",src:n(121).default})),Object(i.b)("h2",{id:"test-in-production-environment"},"Test in production environment"),Object(i.b)("p",null,"Once the deploy phase is finished and you are confident that there are no relevant errors in production,\ntry to make some integration tests against what has been just released (ie. by calling the API directly from Postman or cURL);\naside, check if the other core IO functionalities are still working (ie. manually triggering events using the IO mobile application)."),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Congratulations! You have terminated your first deploy in our production environment using Azure pipelines!")))}p.isMDXComponent=!0},77:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return h}));var a=n(0),o=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=o.a.createContext({}),p=function(e){var t=o.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},b=function(e){var t=p(e.components);return o.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,r=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),b=p(n),d=a,h=b["".concat(r,".").concat(d)]||b[d]||u[d]||i;return n?o.a.createElement(h,c(c({ref:t},s),{},{components:n})):o.a.createElement(h,c({ref:t},s))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,r=new Array(i);r[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,r[1]=c;for(var s=2;s<i;s++)r[s]=n[s];return o.a.createElement.apply(null,r)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);