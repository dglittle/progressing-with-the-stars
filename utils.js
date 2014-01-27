
tau = Math.PI * 2

function colorToCss(c) {
    if (c.length == 3)
        return 'rgb(' + _.map(c, function (x) { return Math.floor(x) }).join(',') + ')'
    return 'rgba(' + _.map(c.slice(0, 3), function (x) { return Math.floor(x) }).join(',') + ',' + c[3] + ')'
}

function dot(a, b) {
    var sum = 0
    for (var i = 0; i < a.length; i++)
        sum += a[i] * b[i]
    return sum
}

function sub(a, b) {
    var x = []
    for (var i = 0; i < a.length; i++)
        x[i] = a[i] - b[i]
    return x
}

function mul(a, b) {
    var x = []
    for (var i = 0; i < a.length; i++)
        x[i] = a[i] * b[i]
    return x
}

function mag(a) {
    return Math.sqrt(dot(a, a))
}

function angleBetween(a, b) {
    return Math.acos(dot(a, b) / (mag(a) * mag(b)))
}

function drawShareButtons(message, url, cb) {
    var d = $('<div/>')

    var shares = [
        {
            type : 'facebook',
            img : 'images/facebook_grey.png',
            url : createFacebookShareLink(url, '', message, '')
        },
        {
            type : 'twitter',
            img : 'images/twitter_grey.png',
            url : createTwitterShareLink(message + ' ' + url)
        },
        {
            type : 'google+',
            img : 'images/google_plus_grey.png',
            url : createGooglePlusShareLink(url)
        }
    ]

    _.each(shares, function (share, i) {
        d.append($('<img style="cursor:pointer;' + (i < shares.length - 1 ? 'margin-right:10px' : '') + '"/>').attr('src', share.img).click(function () {
            cb(share.type)
            window.open(share.url, 'share url', 'height=400,width=500,resizable=yes')
        }))
    })

    return d
}

function createFacebookShareLink(url, img, title, summary) {
    return 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + _.escapeUrl(url) + '&p[images][0]=' + _.escapeUrl(img) + '&p[title]=' + _.escapeUrl(title) + '&p[summary]=' + _.escapeUrl(summary)
}

function createTwitterShareLink(tweet) {
    return 'http://twitter.com/home?status=' + _.escapeUrl(tweet)
}

function createGooglePlusShareLink(url) {
    return 'https://plus.google.com/share?url=' + _.escapeUrl(url)
}

function splitSizeHelper2(size) {
    if (size == null) return ""
    if (size <= 1) return Math.round(100 * size) + '%'
    return size + 'px'
}

function splitHorzMedian(aSize, bSize, a, b, median, fill) {
    if (fill === undefined) fill = true
    aSize = _.splitSizeHelper('width', aSize)
    bSize = _.splitSizeHelper('width', bSize)
    mSize = splitSizeHelper2(median)
    var t = $('<table ' + (fill ? 'style="width:100%;height:100%"' : '') + '><tr valign="top"><td class="a" ' + aSize + '></td><td width="' + mSize + '"><div style="width:' + mSize + '"/></td><td class="b" ' + bSize + '></td></tr></table>')
    // don't do this:
    // t.find('.a').append(a)
    // t.find('.b').append(b)
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
}

function grid(rows) {
    var t = []
    t.push('<table style="width:100%;height:100%">')
    _.each(rows, function (row, y) {
        t.push('<tr height="33.33%">')
        _.each(row, function (cell, x) {
            var c = 'x' + x + 'y' + y
            t.push('<td class="' + c + '" width="33.33%"/>')
        })
        t.push('</tr>')
    })
    t.push('</table>')
    t = $(t.join(''))

    _.each(rows, function (row, y) {
        _.each(row, function (cell, x) {
            var c = 'x' + x + 'y' + y
            t.find('.' + c).append(cell)
        })
    })

    return t
}

function center(me) {
    var t = $('<table style="width:100%;height:100%"><tr><td valign="center" align="center"></td></tr></table>')
    t.find('td').append(me)
    return t
}

$.fn.myAppend = function (args) {
    for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i]
        if (a instanceof Array)
            $.fn.myAppend.apply(this, a)
        else
            this.append(a)
    }
    return this
}

function cssMap(s) {
    var m = {}
    _.each(s.split(';'), function (s) {
        var a = s.split(':')
        if (a[0])
            m[_.trim(a[0])] = _.trim(a[1])
    })
    return m
}

$.fn.myCss = function (s) {
    return this.css(cssMap(s))
}

$.fn.myHover = function (s, that) {
    var that = that || this
    var m = cssMap(s)
    var old = _.map(m, function (v, k) {
        return that.css(k)
    })
    this.hover(function () {
        that.css(m)
    }, function () {
        that.css(old)
    })
    return this
}

$.fn.addLabel = function (d) {
    if (typeof(d) == "string") d = $('<span/>').text(d)
        
    var id = _.randomString(10, /[a-z]/)
    this.attr('id', id)
    this.after($('<label for="' + id + '"/>').append(d))
    return this
}


function rotate(me, amount) {
    var s = 'rotate(' + amount + 'deg)'
    me.css({
        '-ms-transform' : s,
        '-moz-transform' : s,
        '-webkit-transform' : s,
        '-o-transform' : s
    })
    return me
}

jQuery.fn.extend({
    rotate : function (amount) {
        return this.each(function () {
            rotate($(this), amount)
        })
    }
})

function createThrobber() {
    var d = $('<div style="width:30px;height:10px;background:transparent"/>')
    var dd = $('<div style="width:0px;height:10px;background:blue"/>')
    d.append(dd)
    var start = _.time()
    var i = setInterval(function () {
        if ($.contains(document.documentElement, d[0])) {
            var t = (_.time() - start) / 1000
            t *= 6
            var w = _.lerp(-1, 10, 1, 30, Math.sin(t))
            dd.css('width', w + 'px')
            dd.css('margin-left', (30 - w) / 2 + 'px')
        } else
            clearInterval(i)
    }, 30)
    return d;
}
