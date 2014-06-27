Package.describe({
    summary: "Works like Meteor's Session, but bound to template instances."
});

Package.on_use(function (api) {

    // third party
    api.use('underscore', 'client');

    api.export('TemplateSession');

    // FILES
    api.add_files('TemplateSession.js', 'client');
});

Package.on_test(function (api) {

    api.use('template-session');
    api.use('tinytest');
    api.add_files('TemplateSession_tests.js', 'client');

});