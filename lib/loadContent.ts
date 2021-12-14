/**
 * Fetch data from an api route and return the data's content string
 * @param path the path to fetch from - probably staring /api/content/
 * @returns the content, or null if the request fails.
 */
async function loadContent(path: string): Promise<string | null> {

    const response = await fetch(path).catch(error => {
        console.warn(error)
        return null
    });

    if (!response) {
        console.warn(`load content <${path}> failed: no response`);
        return null
    }

    const data = await response.json();

    if (!data.content || data.error) {
        console.warn(`load content <${path}> failed:`, data);
        return null
    }

    return data.content
}


export { loadContent }