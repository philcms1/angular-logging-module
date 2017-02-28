 (function() {
     'use strict';
     angular.module('appLogging').factory('$log', ['AppContext', 'AppConfig', logFactory]);

     function logFactory(AppContext, AppConfig) {
         var
             soaaLogger, consoleAppender,
             ajaxAppender, jsonLayout;

         soaaLogger = log4javascript.getLogger('soaa');
         // Initialize log4javascript appenders
         // console
         consoleAppender = new log4javascript.BrowserConsoleAppender();
         soaaLogger.addAppender(consoleAppender);
         // batch to backend server
         ajaxAppender = new log4javascript.AjaxAppender(AppConfig.logUrl);
         jsonLayout = new log4javascript.JsonLayout();
         // Adding custom fields
         jsonLayout.setCustomField('sourceApp', AppConfig.serviceName);
         jsonLayout.setCustomField('browserUserAgent', navigator.userAgent);
         jsonLayout.setCustomField('requestId', AppContext.requestId);
         jsonLayout.setCustomField('focusPersonMmi', SapphireContext.mmi);
         ajaxAppender.setLayout(jsonLayout);
         ajaxAppender.setSendAllOnUnload(true);
         ajaxAppender.setBatchSize(AppConfig.logBatchSize);
         ajaxAppender.addHeader('Content-Type', 'application/json');
         soaaLogger.addAppender(ajaxAppender);
         // Set default log level to INFO -- lower levels won't be logged
         log4javascript.getLogger('soaa').setLevel(log4javascript.Level[AppConfig.loggingLevel]);

         return soaaLogger;
     }
 }) ();
