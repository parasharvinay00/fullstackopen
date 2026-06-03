const axios = require('axios');

// Using try/catch
async function main() {
    try {
        const anecdotesResponse = await axios.get('https://raw.githubusercontent.com/sahilrajput03/loveapi.ml/master/fso/anecdotes.json');
        const { anecdotes } = anecdotesResponse.data;
        console.log("✅ ~ anecdotes?", anecdotes);
    } catch (e) {
        console.log('❌ Error1:', { name: e.name, message: e.message });
    } finally {
        console.log('🎉 (1) I always run in the final.');
    }

    try {
        const myResponse = await axios.get('bad_url_here');
        console.log(myResponse.data);
    } catch (e) {
        console.log('❌ Error2:', { name: e.name, message: e.message });
    } finally {
        console.log('🎉 (2) I always run in the final.');
    }
}

main();