var fs = require('fs');



module.exports = function (app) {

    //
    // VOTE 
    //
    app.get('/', function (req, res) {
        var question = getQuestion(req);
        res.render('index', { title: 'Home Page.  ', question: question })
    });

    app.post('/', function (req, res) {
        var question = getQuestion(req);
        console.log(req.param("vote"));
        for (var i = 0; i < question.options.length; i++) {
            if (question.options[i].name == req.param("vote")) {
                question.options[i].count++;
                console.log('counted one vote for ' + question.options[i].name);
            }
        }
        if (question.totalVotes == undefined)
            question.totalVotes = 0;
        question.totalVotes++;
        app.get('sio').sockets.emit('update', question);
        res.redirect('/results');
    })

    //
    // ADMIN
    //
    app.get('/admin', function (req, res) {
        if (!req.loggedIn) {
            req.session.redirectTo = '/admin';
            return res.redirect(app.get("everyauth").password.getLoginPath());
        }
        res.render('admin', { title: 'admin  ' });
    });

    //
    // ADMIN
    //
    app.post('/admin', function (req, res) {
        var question = {
            text: req.param("question"),
            options: [],
            totalVotes: 0
        }

        for (var i = 1; i < 4; i++) {
            question.options[i - 1] = {
                type: "radio",
                name: "opt" + i,
                text: req.param("opt" + i),
                count: 0
            };
        }
        saveQuestion(req, question);
        res.redirect('/');
    })

    //
    // RESULTS
    //
    app.get('/results', function (req, res) {
        res.render('results', { question: getQuestion(req) });
    });

    //
    // ABOUT
    //
    app.get('/about', function (req, res) {
        res.render('about', { title: 'About Me.  ' })
    });


    // question loading / saving

    function getQuestion(req) {
        if (req.session.question == null) {
            var question = JSON.parse(fs.readFileSync('question.json', 'utf8'));
            req.session.question = question;
        }
        return req.session.question;
    }



    function saveQuestion(req, question) {
        req.session.question = question;
        fs.writeFileSync('question.json', JSON.stringify(question), 'utf8');
    }
}
