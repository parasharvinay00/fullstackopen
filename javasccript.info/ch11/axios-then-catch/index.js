const axios = require('axios');

// Using then/catch

axios
    .get('https://raw.githubusercontent.com/sahilrajput03/loveapi.ml/master/fso/anecdotes.json')
    .then((anecdotesResponse) => {
        const { anecdotes } = anecdotesResponse.data;
        console.log('✅ ~ anecdotes?', anecdotes);
    })
    .catch((e) => {
        console.log('❌ Error1:', { name: e.name, message: e.message });
    })
    .finally(() => {
        console.log('🎉 (1) I always run in the final.');
    });

axios
    .get('bad_url_here')
    .then((myResponse) => {
        console.log(myResponse.data);
    })
    .catch((e) => {
        console.log('❌ Error2:', { name: e.name, message: e.message });
    })
    .finally(() => {
        console.log('🎉 (2) I always run in the final.');
    });