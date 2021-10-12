const App = {
    data() {
        return {
            userId: 0,
            chatData: [],
            selectMessage: '',
            menuShow: false,
            urls: {
                url_addMessage: 'https://localhost:44392/api/plan/AddMessage'
            },
            message: ''
        }
    },
    methods: {
        // init() {
        //     let source = this
        //     $.connection.hub.logging = true;
        //     var chatHub = $.connection.serviceHub;
        //     console.log(chatHub);
        //     // client function
        //     chatHub.client.newMessage = function (message) {
        //         console.log(message);
        //         console.log(source.focus);
        //         // 判斷是否focus，如果為是，則送put去修改已讀表格
        //         $('#ulChatMessages').append('<li>' + message + '</li>');
        //     }
        //     // client function
        //     chatHub.client.alert = function (message) {
        //         console.log(message);
        //     }
        //     // Add 1
        //     chatHub.client.updateMessageRead = function (MessageId) {
        //         console.log(MessageId);
        //     }
        //     // AddMessage
        //     chatHub.client.addMessage = function (tripChatRoom) {
        //         console.log(tripChatRoom);
        //     }
        //     // DeleteMessage
        //     chatHub.client.deleteMessage = function (MessageId) {
        //         console.log(MessageId);
        //     }

        //     $.connection.hub.start().done(function () {
        //         // 加入群組，TripId
        //         chatHub.server.joinAGroup('44');
        //     })
        // },
        addMessage() {
            let now = new Date();
            let request = {
                TripId: this.chatData.TripId,
                UserId: this.userId,
                Time: `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getDate()).toString().padStart(2, '0')} ${(now.getHours()).toString().padStart(2, '0')}:${(now.getMinutes()).toString().padStart(2, '0')}:${now.getSeconds()}.${now.getMilliseconds()}}`,
                Message: this.message
            }
            console.log(request);
            axios.post(this.urls.url_addMessage, request).then(res => {
                console.log(res);
            })
        },
        deleteSelectMessage() {
            console.log(this.selectMessage);
        },
        getChatData() {
            let url = 'https://raw.githubusercontent.com/r04941090/FileStorage/master/Chat_new5'
            let url2 = 'https://localhost:44392/api/plan/ReadAllMessage/44'
            axios.get(url2).then(res => {
                console.log(res);
                this.chatData = res.data
                console.log(this.chatData);
                this.$refs.room.scrollTop = this.$refs.room.scrollHeight
                this.$nextTick(() => {
                    // https://iter01.com/581627.html
                    console.log(this.$refs.room.scrollTop, this.$refs.room.scrollHeight);
                    this.$refs.room.scrollTop = this.$refs.room.scrollHeight
                });
            })
        },
        getSelectMessage(message, event) {
            this.menuShow = true
            let contextElement = this.$refs.contextMenu
            contextElement.style.top = event.y + "px";
            contextElement.style.left = event.x + "px";
            this.selectMessage = message
        },
        clearSelectMessage(e) {
            this.menuShow = false
        },
        groupBy(array, f) {
            // https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/157462/
            let groups = {};
            array.forEach(function (o) {
                let group = JSON.stringify(f(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map(function (group) {
                return groups[group];
            });
        }
    },
    computed: {
        MessageContent: function () {
            if (this.chatData.MessageContent !== undefined) {
                console.log(this.chatData.MessageContent);
                let sortData = []
                let sorted = this.groupBy(this.chatData.MessageContent, function (item) {
                    return [item.Time.split(' ')[0]];
                });
                console.log(sorted);
                let UserId = 0
                sorted.forEach(sortByDay => {
                    let element = {
                        PostDate: sortByDay[0].Time.split(' ')[0],
                        MessageBox: []
                    }
                    let sortByTime = this.groupBy(sortByDay, function (item) {
                        return [item.Time.split(' ')[1]];
                    })

                    sortByTime.forEach(item1 => {
                        let BeforeUserId = 0
                        item1.forEach((item2, index) => {
                            if (index == 0) {
                                item2.showArrow = true
                                UserId = item2.UserId
                            }
                            else {
                                if (UserId !== item2.UserId) {
                                    item2.showArrow = true
                                    UserId = item2.UserId

                                }
                                else {
                                    item2.showArrow = false
                                }
                            }
                            if (index !== item1.length - 1) {
                                if (item1[index + 1].UserId !== item2.UserId) {
                                    item2.showTime = true
                                }
                                else {
                                    item2.showTime = false
                                }
                            }
                            else {
                                item2.showTime = true
                            }
                            let hour = item2.Time.split(' ')[1].split(':')[0]
                            let minute = item2.Time.split(' ')[1].split(':')[1]
                            item2.PostType = hour > 11 ? '下午' : '上午'
                            item2.PostTime = hour > 12 ? `${hour - 12}:${minute}` : `${hour}:${minute}`
                            element.MessageBox.push(item2)
                        })
                    })
                    sortData.push(JSON.parse(JSON.stringify(element)))
                    console.log(sortByTime);
                })
                
                console.log(sortData);
                return sortData
            }
        }
    },
    mounted() {
        // this.init();
        this.getChatData()
        window.addEventListener('click', this.clearSelectMessage)
    },
}
Vue.createApp(App).mount('#app')
