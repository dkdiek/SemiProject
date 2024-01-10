"use strict"
const socket = io();

const nickname = document.querySelector("#nickname");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayContainer = document.querySelector(".display-container")

// 인풋 박스에서 엔터 쳤을 때
chatInput.addEventListener("keypress",(event)=>{
    if(13 === event.keyCode){
        send();
        chatInput.value='';
        chatInput.focus();
    }
})
// 인풋 박스 전송 클릭
sendButton.addEventListener("click", () => {
    send();
    chatInput.value='';
    chatInput.focus();
});

// 메세지 전송 함수
function send () {
    const param = {
        name : nickname.value,
        msg: chatInput.value
    }
    socket.emit("chatting", param)
}

socket.on("chatting", (data) => {
    const { name, msg, time } = data; // 받은 데이터를 쪼개서 담는다
    const item = new LiModel(name, msg, time);
    item.makeLi();
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
} )

function LiModel(name, msg, time){
    this.name = name;
    this.msg = msg;
    this.time = time;

    this.makeLi = () => {
        const li = document.createElement("li");
        li.classList.add(nickname.value === this.name ? "sent" : "received")
        const dom = `<div id="chat-container">
                        <div id="chat-container-top">
                            <span class="user">${this.name}</span>
                        </div>
                        <div id="chat-container-bottom">
                            <span class="profile">
                                <img class="image" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="anu">
                            </span>
                            <span class="message">${this.msg}</span>
                            <span class="time">${this.time}</span>
                        </div>
                    </div>`;
        li.innerHTML = dom;
        chatList.appendChild(li);
    }
}