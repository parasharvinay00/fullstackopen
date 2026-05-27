function main() {
    console.log('main?');
    while (true) {
        try {
            throw new Error('oops');
        } catch (error) {
            break;
        } finally {
            console.log('finally ran?'); // this still runs before the break takes effect
        }
    }
}

main();
// Output:
// main?