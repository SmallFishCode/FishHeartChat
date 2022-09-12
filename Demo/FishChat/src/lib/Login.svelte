<script lang="ts">
  import axios from "../ajax/index";

  import { io, Socket } from "socket.io-client";
  import { onDestroy, onMount } from "svelte";

  // 心跳时间
  const time = 60000
  let HeartCount = 60

  // login 逻辑
  interface IuserInfo {
    userName: string;
    password: string;
  }
  let userName: string = "";
  let password: string = "";
  let changePages: Number = 0;

  let userArr = [];

  const submit = () => {
    const params: IuserInfo = {
      userName: userName || "匿名",
      password: password,
    };
    userArr.push(userName);
    socket.emit("userInfo", params, userArr);
    // axios.post('/user', params)
    changePages = 1;
    socket.emit('hert', userName, time)
    socket.on('error', () => {
        changePages = 0
    })
  };

  window.onload = function () {
    localStorage.removeItem("close");
    if (localStorage.getItem("tab") == "true" && changePages === 1) {
      socket.emit("init", userName);
    } else {
      localStorage.setItem("tab", "true");
    }
  };

  window.onbeforeunload = () => {
    if (localStorage.getItem("tab") == "true" && changePages === 1) {
      socket.emit("init", userName);
    } 
    localStorage.removeItem("tab");
    }

    
    

  // chat 逻辑
  let sendData = "";
  let list = [];

  const socket = io('ws://112.124.32.18:3333');
//   const socket = io("ws://localhost:3333");

  const sendOn = (e) => {
    if (e.keyCode === 13) {
      socket.emit("sendData", sendData, userName);
      socket.emit('hert', userName, time)
      HeartCount = 60
      sendData = "";
    }
  };

  const sendOnApp = (e) => {
    socket.emit("sendData", sendData, userName);
    socket.emit('hert', userName, time)
    HeartCount = 60
    sendData = "";
  };

  socket.on("everybody", (data, un) => {
    list.push([un, data]);
    list = list;
    let message = document.getElementById("mes");

    setTimeout(() => {
      message.scrollTop = message.scrollHeight;
    }, 0);
  });
  socket.on("userArr", (arr) => {
    userArr = [...arr];
  });

  const changeLogin = () => {
    changePages = 0;
    if (userName === "") {
      userName = "匿名";
    }
    socket.emit("perRemove", userName, userArr);
  };

  socket.on("into", (mesPer) => {
    setTimeout(() => {
      let message = document.getElementById("mes");
      message.scrollTop = message.scrollHeight;
    }, 10);
  });
  socket.on("sysInto", (mesPer) => {
    list.push(["Welcome", mesPer.mes]);
    list = list;
  });
  socket.on("leave", (mesPer) => {
    setTimeout(() => {
      let message = document.getElementById("mes");
      if (message) message.scrollTop = message.scrollHeight;
    }, 10);
  });
  socket.on("sysOut", (mesPer) => {
    list.push(["GoodBay", mesPer.mes]);
    list = list;
  });

  socket.on('disconnect', function(){
    socket.emit("init", userName);
});


    // 心跳检测滴答钟
    socket.on('hertTime', (time) => {
        HeartCount = time
    })


</script>

<main>
  {#if changePages === 0}
    <div class="header">
      <div class="header_text">FishHeartChat</div>
      <div class="header_heart">鱼的一分钟心跳</div>
    </div>
   
    <div class="login_warp">
      <div class="login_header">Login</div>
      <div class="userName">
        <label for="nn" class="un_label">Nn:</label>
        <input
          id="nn"
          class="login_un"
          type="text"
          placeholder="Please input nickName..."
          bind:value={userName}
        />
      </div>
      <!-- <div class="password">
                <label for="pw" class="un_label">Pw:</label>
                <input id="pw" class="login_un" type="text" placeholder="Please input password..." bind:value={password}>
            </div> -->
      <div class="submit">
        <button class="sub_buttom" on:click={submit}>Go</button>
      </div>
      <div class="tips">
        用户名不可重复 若登录后弹出 则说明重复
      </div>
      <div class="tips_item">
        保持一分钟至少一条消息的频率
      </div>
      <div class="tips_item">
        否则会被心跳检测踢出聊天室
      </div>
    </div>
  {:else if changePages === 1}
    <div style="box-sizing: border-box;">
      <div
        style="width: 100%;height: 30px;font-size: 20px;
            font-weight: bold;
            color: rgb(233, 29, 175);
            display:flex"
      >
        <div on:click={changeLogin}>FishHeartChat  BackLogin</div> 
        <div style="align-items: center;
        justify-content: center;display:flex; border: 3px solid red; font-size: 14px;width: 40px; height: 40px; border-radius: 50%; color:red; font-weight: bold; margin-left: 40px">{HeartCount}</div>
      </div>
      <div style="width: 100%;display: flex;">
        <div style="width: 110px; margin-right: 10px;overflow-y: scroll">
          <div
            style="width: 110px;height: 50px; border-right: 1px solid rgb(233, 29, 175);color: rgb(198, 126, 243); font-weight:600;margin-top: 10px"
          >
            Person: {userArr.length}
          </div>
          {#each userArr as item, index}
            <div
              style="border-radius: 5px;font-size: 14px;padding-left:3px;line-height: 30px; width: 90px; min-height: 30px;color: rgb(13, 201, 248);border: 1px solid rgb(13, 201, 248); margin-bottom: 8px"
            >
              {item ? item : "匿名"}
            </div>
          {/each}
        </div>
        <div style="felx: 1; ">
          <div>
            <div
              id="mes"
              style="width: 100%; height: 380px; margin-top:20px; overflow-y: scroll;"
            >
              {#each list as item, index}
                <div
                  style="font-size: 12px;color:rgb(44, 95, 214);width: 100%; min-height:40px; border-bottom: 1px solid rgb(198, 126, 243); margin-bottom: 4px; line-height: 40px "
                >
                  {item[0] ? item[0] : "匿名"} : {item[1]}
                </div>
              {/each}
            </div>
            <div
              style="color: rgb(198, 126, 243); font-weight:600; margin-bottom: 8px"
            >
              请输入您想发送的信息：(PC 回车可发送) <button
                style="border: none; color:white; background-color:rgb(198, 126, 243)"
                on:click={sendOnApp}>发送</button
              >
            </div>
            <div style="width: 100%;">
              <textarea
                bind:value={sendData}
                on:keyup={sendOn}
                style="box-sizing:border-box;padding-left:10px; width:100%;height: 150px;border:none; color:rgb(198, 126, 243);"
                placeholder="Please input something..."
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>

<style lang="less">
  .header {
    width: 100%;
    height: 60px;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    &_text {
        margin-top: 20px;
      font-size: 30px;
      font-weight: bold;
      color: rgb(233, 29, 175);
    }
    &_heart {
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
        color: rgb(247, 120, 70);
    }
  }
  .login_warp {
    width: 100%;
    height: 400px;
    .login_header {
      margin-top: 50px;
      color: rgb(198, 126, 243);
      font-weight: bold;
      height: 40px;
      text-align: center;
    }
    .userName {
      display: flex;
      margin-top: 20px;
      justify-content: center;
      align-items: center;
      .un_label {
        color: rgb(198, 126, 243);
      }
      .login_un {
        margin-left: 5px;
        width: 180px;
        height: 30px;
        border-radius: 5px;
        border: 2px solid rgb(198, 126, 243);
        color: rgb(198, 126, 243);
        padding-left: 5px;
      }
    }
    .password {
      margin-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      .un_label {
        color: rgb(198, 126, 243);
      }
      .login_un {
        margin-left: 5px;
        width: 180px;
        height: 30px;
        border-radius: 5px;
        border: 2px solid rgb(198, 126, 243);
        color: rgb(198, 126, 243);
        padding-left: 5px;
      }
    }
    .submit {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      .sub_buttom {
        width: 100px;
        height: 40px;
        color: #fff;
        background: rgb(198, 126, 243);
        border-radius: 5px;
        border: none;
      }
    }
    .tips {
        width: 100%;
        height: 200px;
        color: rgb(107, 43, 147);
        font-weight: bold;
        margin-top: 50px;
        text-align: center;
    }
    .tips_item {
        width: 100%;
        height: 30px;
        color: rgb(107, 43, 147);
        font-weight: bold;
        margin-top: 10px;
        text-align: center;
        
    }
  }
</style>
