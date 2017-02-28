 (function() {
     'use strict';
     angular.module('soaaLogging').factory('$log', ['appContext', 'appConfig', logFactory]);

     function logFactory(appContext, appConfig) {
         var
             soaaLogger, consoleAppender,
             ajaxAppender, jsonLayout;

         soaaLogger = log4javascript.getLogger('soaa');
         // Initialize log4javascript appenders
         // console
         consoleAppender = new log4javascript.BrowserConsoleAppender();
         soaaLogger.addAppender(consoleAppender);
         // batch to backend server
         ajaxAppender = new log4javascript.AjaxAppender(appConfig.logUrl);
         jsonLayout = new log4javascript.JsonLayout();
         // Adding custom fields
         jsonLayout.setCustomField('sourceApp', appConfig.serviceName);
         jsonLayout.setCustomField('browserUserAgent', navigator.userAgent);
         jsonLayout.setCustomField('requestId', appContext.requestId);
         jsonLayout.setCustomField('focusPersonMmi', SapphireContext.mmi);
         ajaxAppender.setLayout(jsonLayout);
         ajaxAppender.setSendAllOnUnload(true);
         ajaxAppender.setBatchSize(appConfig.logBatchSize);
         ajaxAppender.addHeader('Content-Type', 'application/json');
         soaaLogger.addAppender(ajaxAppender);
         // Set default log level to INFO -- lower levels won't be logged
         log4javascript.getLogger('soaa').setLevel(log4javascript.Level[appConfig.loggingLevel]);

         return soaaLogger;
     }
 }) ();
