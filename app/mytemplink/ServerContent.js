

export default async function ServerContent({id}) {

    let response = await fetch(`http://localhost:3000/api/files?id=${id}`);
    response = await response.json();

    return (
        <div>
            <h1>Server Content</h1>
            <p>This content is server side rendered</p>
        </div>
    )

}