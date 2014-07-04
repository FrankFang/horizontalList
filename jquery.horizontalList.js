/* Created by frank on 14-7-4. */

define(['jquery'], function ($) {

    var defaults = {
        prevClassName: '',
        nextClassName: '',
        duration: 150
    }

    $.fn.horizontalList = function (_options) {

        var $list = this
        var options
        if (_options) {
            options = $.extend({}, defaults, _options)
            $list.data('horizontalListOptions', options)
        } else {
            options = $list.data('horizontalListOptions')
        }


        var currentIndex = 0
        var initialized = $list.data('horizontalList')

        var $view, $wrapper, $prev, $next, step

        if (!initialized) {

            this.css({position: 'relative', left: 0})

            // add view , wrapper, prev and next button
            $view = this.wrap('<div class="hList_view"></div>').parent().css({'overflow': 'hidden'})
            $wrapper = $view.wrap('<div class="hList"></div>').parent().css({position: 'relative'})
            $prev = $('<span class="hList_control hList_control-prev" title="previous"></span>').appendTo($wrapper)
                .on('selectstart', prevent)
            $next = $('<span class="hList_control hList_control-next" title="next"></span>').appendTo($wrapper)
                .on('selectstart', prevent)
            $list.data('horizontalList', true)

            if (options.prevClassName) {
                $prev.addClass(options.prevClassName)
            }
            if (options.nextClassName) {
                $next.addClass(options.nextClassName)
            }

        } else {
            $view = this.parent()
            $wrapper = $view.parent()
            $prev = $wrapper.children('span').eq(0)
            $next = $wrapper.children('span').eq(1)
        }

        var $items = this.children('li')
        var itemCount = $items.length
        if (itemCount === 0) {return}

        this.width(itemCount * $items.eq(0).width())

        var maxVisibleCount = parseInt($view.width() / $items.eq(0).width(), 10)

        step = maxVisibleCount - 1

        $prev.off('click').on('click', function () {
            setCurrentIndex('-=' + step)
        })
        $next.off('click').on('click', function () {
            setCurrentIndex('+=' + step)
        })

        setCurrentIndex(0)

        function setCurrentIndex(value) {
            value += ''
            if (value.indexOf('-=') === 0) {
                currentIndex -= parseInt(value.substr(2), 10)
            } else if (value.indexOf('+=') === 0) {
                currentIndex += parseInt(value.substr(2), 10)
            } else {
                currentIndex = parseInt(value, 10)
            }
            if (currentIndex >= itemCount - maxVisibleCount) {
                currentIndex = itemCount - maxVisibleCount
                $next.hide()
            } else {
                $next.show()
            }
            if (currentIndex <= 0) {
                currentIndex = 0
                $prev.hide()
            } else {
                $prev.show()
            }

            $list.stop(true, true).animate({'left': -$items.eq(0).width() * currentIndex}, options.duration)

        }

        function prevent(e) {
            e.preventDefault()
        }

    }

    return $
})
