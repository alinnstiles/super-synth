import { useState } from "react"

function Comment({current}){

    const [commentLikes, setCommentLikes] = useState(current.likes)

    const handleCommentLike = (comment) => {
        console.log(comment)
        fetch(`/api/patch-comment/${comment.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Flames:": comment.likes + 1
            })
        })
        .then(res => res.json())
        .then(promise => setCommentLikes(promise.likes))
    }

    return(
        <div className="comment">
            <p><b>{current.user.username}</b></p>
            <p>{current.comment}</p>
            <p>{"Flames: " + commentLikes}</p>
            <button onClick={() => handleCommentLike(current)}>🔥</button>
        </div>
    )
}

export default Comment