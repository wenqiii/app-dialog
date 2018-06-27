;(function($) {
    var Dialog = function(config) {
        var _this = this;
        //默认参数配置
        this.config = {
            // 对话框宽度
            width: 'auto',
            // 对话框高度
            height: 'auto',
            // 提示信息
            message: null,
            // 对话框类型
            type: 'waiting',
            // 按钮配置
            buttons: null,
            //弹出框多久关闭
            delay: null,
            // 延迟回调函数
            delayCallback: null,
            //对话框透明度
            maskOpacity: null,
            //点击遮罩层是否可以关闭
            maskClose: null,
            //是否启用动画
            effect: null
        };

        // 默认参数扩展
        // isPlainObject 判断参数是否是一个纯粹的对象，纯粹对象就是指该对象是通过“{}”或“new Object”创建
        if(config && $.isPlainObject(config)) {
            $.extend(this.config, config);  //extend 通过源对象扩展目标对象的属性
        } else {
            this.isConfig = true;
        }

        // 创建基本DOM
        this.body = $("body");
        this.mask = $('<div class="g-dialog-container">');
        this.win = $('<div class="dialog-window">');
        this.winHeader = $('<div class="dialog-header"></div>');
        this.winContent = $('<div class="dialog-content">');
        this.winFooter= $('<div class="dialog-footer">');

        this.create();
    };
    Dialog.prototype = {
        animate: function() {
            var _this = this;
            this.win.css('transform', 'scale(0,0)');
            window.setTimeout(function() {
                _this.win.css('transform', 'scale(1, 1)');
            }, 100)
        },
        create:function() {
            var _this = this,
                config = this.config,
                mask = this.mask,
                win = this.win,
                header = this.winHeader,
                content = this.winContent,
                footer = this.winFooter,
                body = this.body;

            // 如果没有传递任何配置参数
            // 就弹出一个等待的图标
            if(this.isConfig) {
                // append 在每个匹配的元素末尾插入内容
                win.append(header.addClass('waiting'));

                if(config.animate) {
                    this.animate();
                }

                mask.append(win);
                body.append(mask);
            } else {
                // 根据配置参数创建相应的弹框
                header.addClass(config.type);
                win.append(header);
                // 文本信息
                if(config.message) {
                    win.append(content.html(config.message));
                }

                //按钮组
                if(config.buttons) {
                    this.createButtons(footer, config.buttons);
                    win.append(footer);
                }

                mask.append(win);
                body.append(mask);

                // 设置宽高
                if(config.width != 'auto') {
                    win.width(config.width);
                }
                if(config.height != 'auto') {
                    win.height(config.height);
                }

                // 设置透明度
                if(config.maskOpacity) {
                    mask.css("backgroundColor", "rgba(0,0,0," + config.maskOpacity + ")");
                }

                // 设置弹出框的关闭时间
                if(config.delay && config.delay != 0) {
                    window.setTimeout(function() {
                        _this.close();
                        config.delayCallback && config.delayCallback();
                    }, config.delay);
                }

                if(config.effect) {
                    this.animate();
                }

                //点击遮罩层是否可以关闭
                if (config.maskClose) {
                    mask.click(function() {
                        _this.close();
                    });
                }
            }
        },
        createButtons:function(footer, buttons) {
            var _this = this;
            $(buttons).each(function() {
                // 获取按钮信息
                var type = this.type?"class="+this.type+"":'';
                var btnText = this.text?this.text:"按钮"+(++i);
                var callback = this.callback?this.callback:null;

                var button = $("<button " + type + ">" + btnText + "</button>");

                if(callback) {
                    button.click(function(e) {
                        var isClose = callback();

                        // 阻止事件冒泡
                        e.stopPropagation();
                        e.preventDefault();

                        if(isClose != false) {
                            _this.close();                            
                        }
                    });
                } else {
                    button.click(function(e) {
                        // 阻止事件冒泡
                        e.stopPropagation();
                        e.preventDefault();
                        _this.close();
                    });
                }
                footer.append(button);
            })
        },
        close:function() {
            this.mask.remove();
        }
    };

    window.Dialog = Dialog;

    $.dialog = function(config) {
        return new Dialog(config);
    }
})(Zepto);
