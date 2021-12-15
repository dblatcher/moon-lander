/**
 * Fetch a public file and return the file's content as string
 * @param path the path to fetch from - probably staring /content/
 * @returns the content, or null if the request fails.
 */
async function loadContent(path: string): Promise<string | null> {

    const response = await fetch(path);

    if (!response.ok) {
        console.warn(`load content <${path}> failed: ${response.statusText}`);
        return null
    }

    const body = await response.text()

    if (!body) {
        console.warn(`load content <${path}> failed:`);
        return null
    }

    return body
}


export { loadContent }