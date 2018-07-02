'use strict'

;(function () {

    //1. play/pause видео
    //2. изменение громкости
    //3. изменение скорости проигрования видео
    //4. перемотка видео
        // - по клику на полосу прокрутки
        // - потянув полосу прокрутки
        // - по клику на кнопку skip
        // - по клику на кнопки на клавиатуре -> <-
    //5. отображение кол-ва проигрованного времени
    //6. сохранение состояния видео при перезагрузке страницы

    /**
     * Class Player
     * @param {Object} element
     */
    class Player{

        constructor(element){
            this.player = element;
            this.progress = document.querySelector('.progress');
            this.progress_filled = document.querySelector('.progress__filled');
            this.toggle = document.querySelector('.toggle');
            this.skipBtn = document.querySelectorAll('[data-skip]');
            this.ranges = document.querySelectorAll('input[type="range"]');
        }

        init(){
            let self = this;
            this.handle_read_player_state();
            this.dom_events(self);
            this.player_events(self);
        }

        /**
         * dom_events - добавляем обработчик событий на элементы управления
         * @param {Object} self
         */
        dom_events(self){
            // play/pause Listener
            this.toggle.addEventListener('click', (e) => {
                this.toggle_play();
            });

            this.player.addEventListener('click', (e) => {
                this.toggle_play();
            });

            // volume and playbackRate Listener on change
            this.ranges.forEach( range => {
                range.addEventListener('change', function(e){
                    self.handle_range_update(this);
                    // self - Player
                    // this - button ( range )
                })
            } );

            // volume and playbackRate Listener on mousemove
            this.ranges.forEach( range => {
                range.addEventListener('mousemove', function(e){
                    self.handle_range_update(this);
                })
            } );

            // skip Listener on click
            this.skipBtn.forEach( btn => {
                btn.addEventListener('click', function(e){
                    self.handle_skip(this);
                })
            } );

            // time update Listener on click
            this.progress.addEventListener('click', (e) => {
                this.handle_time_update(e);
            })
        }

        /**
         * player_events - добавляем обработчик событий для тега видио
         * @param {Object} self
         */
        player_events(self){
            this.player.addEventListener('play', (e) => {
                this.update_toggle_icon();
            });

            this.player.addEventListener('pause', (e) => {
                this.update_toggle_icon();
            });

            this.player.addEventListener('timeupdate', (e) => {
                this.handle_progress_update();
                this.handle_save_state();
                //this.ranges[0].value = 0.1
            });


        }

        /**
         * play/pause видео
         */
        toggle_play(){
            let method = this.player.paused ? 'play' : 'pause';
            this.player[method](); // this.player['play']() || this.player['pause']()
        }

        /**
         * изменение иконки play/pause
         */
        update_toggle_icon(){
            let icon = this.player.paused ? '►' : '❚ ❚';
            this.toggle.textContent = icon;
        }

        /**
         * изменение скорости и звука ни слайдерах
         * @param input
         */
        handle_range_update(input){
            this.player[input.name] = input.value;
        }

        // создали свойство для кнопок перемотки
        handle_skip(btn){
            this.player.currentTime += parseFloat(btn.dataset.skip);
        }

        handle_progress_update(){
            let percent = (this.player.currentTime / this.player.duration) * 100;
            this.progress_filled.style.width = `${percent}%`;
        }

        handle_time_update(event_obj){
            let time = (event_obj.offsetX / this.progress.offsetWidth) * this.player.duration ;
            this.player.currentTime = time;
        }

        handle_save_state(){
            let state = {
                currentTime: this.player.currentTime,
                volume: this.player.volume,
                playbackRate: this.player.playbackRate
            };

            localStorage.setItem('player_state', JSON.stringify(state));
        }

        handle_read_player_state(){
            if ( !localStorage.player_state ) return;
            let state = JSON.parse(localStorage.player_state);
            for ( let key in state ){
                this.player[key] = state[key];
                this.ranges.forEach( range => {
                    if ( key === range.name ){
                        range.value = state[key];
                    };
                })
            }

        }


    }

    let videoTag = document.querySelector('.viewer');

    let player = new Player( videoTag );
    player.init(); // start player

})();