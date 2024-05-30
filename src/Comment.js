import { useState } from "react"

function Comment({current}){

    const [totalLikes, setTotalLikes] = useState(current.likes)
    const [commentLikes, setCommentLikes] = useState(false)

    const handleCommentLike = () => {
        fetch(`/api/patch-comment/${current.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "likes": totalLikes + (commentLikes ? (-1) : (1))
            })
        })
        .then(res => res.json())
        .then(promise => {
            setTotalLikes(promise.likes)
            setCommentLikes(!commentLikes)
        })
    }

    return(
        <div className="comment">
            <p><b>{current.user.username}</b></p>
            <p>{current.comment}</p>
            <p>{"Flames: " + totalLikes}</p>
            <button onClick={handleCommentLike}>{commentLikes ? "Unflame" : "🔥"}</button>
        </div>
    )
}

export default Comment