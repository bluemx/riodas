export function useScroll () {
    let intervalId = null;

    const start = (element) => {
        intervalId = setInterval(() => {

            element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

        }, 1000); // Adjust interval time as needed
    }

    const stop = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    return {start, stop}
}
