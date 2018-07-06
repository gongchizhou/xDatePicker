(function($){
     $.fn.xDatePicker = function(options){
        var st = {
            range: ['year', 'month', 'season'],
            limit: 5
        }
        var methods = {
            init: function(options){
                st = $.extend(st,options);
                return this.each(function(){
                    var that = $(this);
                    that.addClass('xp');
                    that.html('<div class="xp-inner-wrap"><div class="xp-inner"><div class="range-wrap"><ul class="range"></uL></div></div></div>');
                    methods.generateView.call(this,st);
                    methods.bindEvent.call(this,st);
                })
            },

            generateView: function(st){
                var range = st.range;
                var that = $(this);
                if(typeof range == 'string'){
                    if(range == 'year'){
                        methods.renderYearView.call(this, st);
                    }else if(range == 'month'){
                        methods.renderMonthView.call(this);
                    }else if(range == 'season'){
                        methods.renderSeasonView.call(this);
                    }
                }else if(Array.isArray(range)){
                    if(range[0] == 'month'){
                        methods.renderMonthView.call(this); 
                    }
                    if(range[0] == 'year'){
                        methods.renderYearView.call(this, st);
                    }
                    if(range[0] == 'season'){
                        methods.renderSeasonView.call(this);
                    }
                    if(range.length > 1){
                        that.append(methods.renderSelect(range, range[0])).css('paddingRight','100px');
                    }else{
                        that.css('paddingRight','0');
                    }
                }else{
                    console.error('wrong option format');
                }
            },

            renderMonthView: function(){
                var m = [];
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                for(var i=0; i<12; i++){
                    if(month == 0){
                        month = 12;
                        year--;
                    }
                    m.push({
                        year: year,
                        month: month--
                    });
                }
                var html = m.map(function(item){
                    var date = item.year + '-' + (item.month < 10 ? ('0'+item.month) : item.month);
                    return '<li data-value="'+ date +'">'+ date +'</li>'
                }).join('')
                var length = 78*12 + 10;
                var wrapL = $(this).find('.xp-inner').width();
                $(this).find('.range').html(html).parent().width('100%');
                if(length > wrapL){
                    $(this).find('.range').parent().width(length);
                }

                methods.renderPoints.call(this);

                function calcMonth(m){
                    if(m < 1){
                        m = 12;
                    }
                    return m;
                }
            },

            renderSeasonView: function(){
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var s = [[1,2,3], [4,5,6], [7,8,9], [10,11,12]];
                var seasons = [];
                var sIndex;
                s.forEach(function(item, index){
                    if(item.indexOf(month) > -1){
                        sIndex = index;
                    }
                })
                for(var i=0; i<4; i++){
                    var startM = s[sIndex][0];
                    var endM = s[sIndex][2];
                    seasons.push({
                        name: year + '第' + (sIndex + 1) + '季度',
                        start: year + '-' + (startM > 9 ? startM : ('0' + startM)),
                        end:  year + '-' + (endM > 9 ? endM : ('0' + endM))
                    })
                    if(--sIndex < 0){
                        sIndex = 3;
                        year--;
                    }
                }
                var html = seasons.map(function(item){
                    return '<li data-start="'+ item.start +'" data-end="'+ item.end +'">'+ item.name +'</li>'
                }).join('');

                $(this).find('.range').html(html).parent().width('100%');

                methods.renderPoints.call(this);
            },

            renderYearView: function(st){
                var years = [];
                var year = new Date().getFullYear();
                for(var i=0; i<st.limit; i++){
                    years.push(year--);
                }
                var html = years.map(function(item){
                    return '<li data-value="'+ item +'">'+ item +'</li>'
                }).join('')
                var length = 78*st.limit + 10;
                var wrapL = $(this).find('.xp-inner').width();
                $(this).find('.range').html(html).parent().width('100%');
                if(length > wrapL){
                    $(this).find('.range').parent().width(length);
                }

                methods.renderPoints.call(this);
            },

            renderSelect: function(range, current){
                var text = this.transText(current);
                var self = this;
                return '<div class="select"><button>'+ text +'</button><ul>' + range.map(function(item, index){
                    if(current !== item){
                        var name = self.transText(item);
                        return '<li data-value="'+ item +'">'+ name +'</li>'
                    }
                }).join('') + '</ul></div>';
            },

            transText: function(text){
                var name;
                if(text == 'year'){
                    name = '按年份';
                }else if(text == 'month'){
                    name = '按月份';
                }else if(text == 'season'){
                    name = '按季度';
                }
                return name;
            },

            renderPoints: function(){
                var that = $(this);
                if(that.find('.range-wrap').width() > that.width()){
                    if(that.find('.next').length == 0){
                        that.find('.xp-inner-wrap').append('<div class="prev"></div><div class="next"></div>').css({'padding': '0 20px'});
                    }
                }else{
                    that.find('.xp-inner-wrap').css({'padding': '0'}).find('.prev, .next').remove();
                }
            },

            bindEvent: function(){
                var that = $(this);
                var scrollWrap = that.find('.xp-inner')[0];
                that.on('click', '.select li', function(e){
                    var value = $(this).data('value');
                    var text = '';
                    if(value == 'year'){
                        text = '按年份';
                        methods.renderYearView.call(that,st);
                    }else if(value == 'month'){
                        text = '按月份';
                        methods.renderMonthView.call(that);
                    }else if(value == 'season'){
                        text = '按季度';
                        methods.renderSeasonView.call(that);
                    }
                    that.find('.select').replaceWith(methods.renderSelect(st.range, value));
                })
                .on('click', '.select', function(e){
                    e.stopPropagation();
                    $(this).find('ul').slideToggle();
                })
                .on('click', '.range li', function(e){
                    var value = $(this).data('value');
                    var start = $(this).data('start');
                    var end = $(this).data('end');
                    var data = {};
                    if(value) data.start = data.end = value;
                    if(start) data.start = start;
                    if(end) data.end = end;
                    $(this).addClass('active').siblings().removeClass('active');
                    that.trigger('date.apply',data);
                })
                .on('click', '.next, .prev', function(e){
                    var isNext = $(e.target).hasClass('next');
                    var prev = that.find('.prev');
                    var next = that.find('.next');
                    var xw = that.find('.range li').outerWidth();
                    var offset = that.find('.range-wrap').width() - that.find('.xp-inner').width();
                    var step = 5;
                    var moved = 0;
                    var timer;
                    scroll(function(){
                        if(scrollWrap.scrollLeft == 0){
                            prev.addClass('not-allowed');
                        }else if(scrollWrap.scrollLeft == offset){
                            next.addClass('not-allowed')
                        }else{
                            prev.removeClass('not-allowed');
                            next.removeClass('not-allowed');
                        }
                    });
                    function scroll(endCallback){
                        clearTimeout(timer);
                        scrollWrap.scrollBy(isNext ? step : -step, 0);
                        if(moved + step >= xw){
                            endCallback();
                            return;
                        }
                        moved += step;
                        timer = setTimeout(function(){
                            scroll(endCallback);
                        }, 10);
                    }
                })
                $(document).on('click',function(){
                    that.find('.select ul').slideUp();
                })
            }
        }
        
        return methods.init.apply( this, arguments );
     }
}(jQuery));