'use client'

export default function CreateFormButton() {

    async function createForm() {
        await fetch('/api/forms', {
            method: 'POST',
        })
    }
    return (
        <button onClick={createForm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Form
        </button>
    )
}
