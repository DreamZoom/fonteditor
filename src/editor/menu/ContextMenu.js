/**
 * @file ContextMenu.js
 * @author mengke01
 * @date 
 * @description
 * 右键菜单设置
 */


define(
    function(require) {

        var lang = require('common/lang');

        /**
         * 创建一个浮动层
         * 
         * @return {HTMLElement} 浮动层对象
         */
        function createPopup(container, options) {
            var div = document.createElement('div');
            div.className = options.className || 'editor-contextmenu';
            div.style.position = 'absolute';
            div.style.zIndex = options.zIndex || 1000;
            div.style.display = 'none';
            container.appendChild(div);
            return div;
        }


        /**
         * 弹出菜单
         * 
         * @constructor
         * @param {HTMLElement} container 主元素
         * @param {Object} options 选项参数
         */
        function ContextMenu(container, options) {
            this.container = container || document.body;
            this.main = createPopup(this.container, options || {});
            this.commands = {};

            var me = this;
            me.main.addEventListener('click', me._command_click = function(e) {
                var key = e.target.getAttribute('data-key');
                if (key) {
                    var event = {
                        command: key,
                        commandArgs: me.commands[key]
                    };
                    me.onClick && me.onClick(event);
                }
            } , false);

            me._hide_click = function(e) {
                me.hide();
            };
        }

        lang.extend(ContextMenu.prototype, {

            /**
             * 设置命令集合
             * 
             * @param {Object} commands 命令集合
             * 
             * @return {this}
             */
            setCommands: function(commands) {
                var str = '';
                Object.keys(commands).forEach(function(key) {
                    str += '<div data-key="'+ key +'">'+ commands[key].title +'</div>';
                });
                this.commands = commands;
                this.main.innerHTML = str;
            },

            /**
             * 展示右键菜单
             * 
             * @return {this}
             */
            show: function(p, commands) {
                if(commands) {
                    this.setCommands(commands);
                }

                this.main.style.display = 'block';
                var maxWidth = this.container.clientWidth;
                var maxHeight = this.container.clientHeight;
                var width = this.main.offsetWidth;
                var height = this.main.offsetHeight;

                var x = p.x + width > maxWidth ? maxWidth - width : p.x;
                var y = p.y + height > maxHeight ? maxHeight - height : p.y;

                this.main.style.left = x + 'px';
                this.main.style.top = y + 'px';

                this.container.addEventListener('click', this._hide_click);
            },

            /**
             * 隐藏右键菜单
             * 
             * @return {this}
             */
            hide: function() {
                this.main.style.display = 'none';
                this.onClick = null;
                this.container.removeEventListener('click', this._hide_click);
            },

            /**
             * 是否打开
             * 
             * @return {boolean} 是否
             */
            visible: function() {
                return this.main.style.display !== 'none';
            },

            onClick: null,

            /**
             * 注销
             */
            dispose: function() {
                this.hide();
                this.main.removeEventListener('click', this._command_click, false);
                this.container.removeEventListener('click', this._hide_click, false);
                this.main.remove();
                this.main = this.container = null;
                this._command_click = this._hide_click = null;
                this.onClick = null;
            }
        });

        return ContextMenu;
    }
);
