$ ->
    socket = io.connect()

    socket.on 'update', (question) ->
        for opt in question.options
            console.log $('#ot' + opt.name)
            $('#ot' + opt.name).text opt.text + ' (' + opt.count + '/' + question.totalVotes + ')'
            $('#prog' + opt.name).css 'width', (opt.count/question.totalVotes*100) + '%'
