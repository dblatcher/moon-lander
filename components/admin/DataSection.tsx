import { useState } from "react";


export default function DataSection(props: {
    message: string
    resetDatabase: Function
}) {
    const { message, resetDatabase } = props;

    const [passwordEntry, setPasswordEntry] = useState<string>("");

    return (
        <section>
            <h2>Database</h2>
            <div>
                <button onClick={() => resetDatabase(passwordEntry)}>RESET</button>
                <input type="text" value={passwordEntry} onChange={event => { setPasswordEntry(event.target.value) }} placeholder="enter reset password" />
            </div>
            <p> :: {message}</p>
        </section>
    )
}