Package.describe({
    name: "mrt:template-session",
    summary: "Deprecated: use mrt:template-session2, Works like Meteor's Session, but bound to template instances.",
    version: "0.2.3",
    git: "https://github.com/frozeman/meteor-template-session.git"
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@0.9.0');

    // core
    api.use('underscore', 'client');

    api.export('TemplateSession');

    // FILES
    api.addFiles('TemplateSession.js', 'client');
});

Package.onTest(function (api) {

    api.use('mrt:template-session');
    api.use('tinytest');
    api.addFiles('TemplateSession_tests.js', 'client');

});