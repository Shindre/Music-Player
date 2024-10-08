const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb")
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist")

const PLAYER_STORAGE_KEY = "PLAYER_STORAGE";

const app = {
    isPlaying: false,
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name:"Buon Hay Vui",
            singer: "MCK-Obito-RonBonz",
            path: "./assets/music/BuonHayVuiFeatRptMckObitoRonboogz-VSOULRPTMCKObitoRonboogz.mp3",
            image: "./assets/img/buon hay vui.jpg"
        },
        {
            name:"De y",
            singer: "WrenEvans",
            path: "./assets/music/DeY-WrenEvans.mp3",
            image: "./assets/img/de y.jpg"
        },
        { 
            name:"ExitSign",
            singer: "HIEUTHUHAI",
            path: "./assets/music/ExitSign-HIEUTHUHAI.mp3",
            image: "./assets/img/exit sign.jpg"
        },
        {
            name:"Hop On Da Show",
            singer: "Tlinh-LowG",
            path: "./assets/music/HopOnDaShow.mp3",
            image: "./assets/img/hop on da show.jpg"
        },
        {
            name:"Mong Yu",
            singer: "Amee",
            path: "./assets/music/MONGYU-AMEEMCK.mp3",
            image: "./assets/img/mong yu.jpg"
        },
        {
            name:"Di Giua Troi Ruc Ro",
            singer: "Original Soundtrack",
            path: "./assets/music/DiGiuaTroiRucRo.mp3",
            image: "./assets/img/digiuatroirucrop.jpg"
        }, 
        {
            name:"Sau loi tu khuoc",
            singer: "Phan Manh Quynh",
            path: "./assets/music/SauLoiTuKhuoc-PhanManhQuynh.mp3",
            image: "./assets/img/sauloitukhuoc.jpg"
        },       
        {
            name:"Hu Khong",
            singer: "Kha",
            path: "./assets/music/HuKhong-Kha.mp3",
            image: "./assets/img/HuKhong.jpg"
        },
        
    ],
    setConfig: function(key,value) {
        this.config[key] = value;    
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? "active": ""}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('');
        },
        defineProperties: function () {
            Object.defineProperty(this,"currentSong",{
                get: function () {
                    return this.songs[this.currentIndex];
                }
            })
        },
        handleEvent: function(){
            const cdWidth = cd.offsetWidth;
            const _this = this;

            // CD animation(play/pasue)
            const cdThumbAnimate = cdThumb.animate([
                {transform: "rotate(360deg)"}
            ],{
                duration: 10000,
                interation: Infinity
            });
            cdThumbAnimate.pause()


            //Next Song
            nextBtn.onclick = function(){
                if(_this.isRandom) {
                    _this.playRandomSong();
                }else{
                    _this.nextSong()
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }

            //Previous Song
            prevBtn.onclick = function(){
                if(_this.isRandom) {
                    _this.playRandomSong();
                }else{
                    _this.prevSong()
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }

            //Random Song BTN
            randomBtn.onclick = function(){
                _this.isRandom = !_this.isRandom
                _this.setConfig("isRandom",_this.isRandom)
                randomBtn.classList.toggle("active",_this.isRandom);
            };

            //Repeat Song BTN
            repeatBtn.onclick = function(){
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig("isRepeat",_this.isRepeat)
                repeatBtn.classList.toggle("active",_this.isRepeat);
            };

            //Ended Song
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click();    
                }
            }

            //Zoom on - Zoom out the CD
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop;

                cd.style.width = newCdWidth> 0 ?  newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth/ cdWidth;
            }

            //Play music btn click
            playBtn.onclick = function(){
                if(_this.isPlaying){
                    audio.pause();
                }else {
                    audio.play();
                }
            }
            // Song is playing
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play()
            };

            // Song is pausing
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove("playing");
                cdThumbAnimate.pause()
            };

            //Song time changes
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPecent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPecent;
                }
            }

            //Song seek
            progress.onchange = function(e){
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }

            //Playlist Click Events
            playlist.onclick = function(e){
                const songNode = e.target.closest(".song:not(.active)");
                if(songNode || e.target.closest(".option")){
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        audio.play();
                        _this.render();
                    }
                    
                }
            }

        },
        loadCurrentSong: function(){
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
            audio.src = this.currentSong.path;
        },
        loadConfig: function(){
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
        },

        nextSong: function(){
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length){
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },
        prevSong: function(){
            this.currentIndex--;
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length -1;
            }
            this.loadCurrentSong();
        },
        playRandomSong: function(){
            let newIndex;
            do{
                newIndex = Math.floor(Math.random() * this.songs.length)
            }while(newIndex === this.currentIndex){
                this.currentIndex = newIndex;
                this.loadCurrentSong();

            }
        },
        scrollToActiveSong: function(){
            setTimeout(()=>{
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest"
                });
            },300)
        },
        start: function(){
            this.defineProperties()

            this.loadConfig()

            this.handleEvent()

            this.loadCurrentSong()

            this.render()
                randomBtn.classList.toggle("active",this.isRandom);
                repeatBtn.classList.toggle("active",this.isRepeat);

        },
    }
    app.start();