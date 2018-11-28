
jQuery.fn.threesixty = function (options) {

  options = options || {};
  options.images = options.images || [];	// image Array
  options.method = options.method || 'click';	// method "click" or "mouseover" and so on.
  options.cycle = options.cycle || 1;	// rotate times on mouseover or click when sross the image.
  options.resetMargin = options.resetMargin || 0;
  options.direction = options.direction || 'forward';
  options.cursor = options.cursor || 'all-scroll';
  options.auto = options.auto || false;	// is auto roteta
  options.speed = options.speed || 150; // rotate speed, ms
  options.showTools = options.showTools || true;
  options.scale = options.scale || 0.1;
  options.zoomLevel = options.zoomLevel || [-5, 5]; // Array
  options.zoomSpeed = options.zoomSpeed || 200; // number

	/**
	*	initialize
	*/
  let timer = null; // timer
  const _this = this;
  let isPause = false; //
  let isFirst = true; //
  let index = null;	// Picture Index
  let direction = 'right'; // Default Direction
  let defautLevel = 0;//
  let originalHeight = $(this).height(),
    originalWidth = $(this).width();

  if (options.showTools) {
    initTools(this);
  }

  if (options.auto) {
    autoPlay(this);
  }

  if (options.direction == 'backward') {
    options.images.reverse();
  }

  return this.each(function () {
    const imgArr = [];
    const pic = $(this);

		// ask browser to load all images..
    $.each(options.images, (index, record) => { const o = $('<img>').attr('src', record).hide();	$('.panorama_box').append(o); });

    for (let x = 1; x <= options.cycle; x++) {
      for (let y = 0; y < options.images.length; y++) {
        imgArr.push(options.images[y]);
      }
    }

		// add the first slice again to complete the loop
    imgArr.push(options.images[0]);

    if (options.method == 'mousemove') {

      pic.mousemove((e) => {
        clearTimer();
        pic.attr('src', imgArr[Math.floor((e.pageX - pic.offset().left) / (pic.width() / imgArr.length))]).css('cursor', options.cursor);
      });
    }

    if (options.method == 'click') {
      let follower;
      if (!$.browser.msie) {
        follower = $('<div>').css({ 'z-index': 0, width: '15px', height: '15px', position: 'absolute', top: pic.offset().top, left: pic.offset().left });

        $('body').append(follower);
        disableSelection(follower[0]);
      }

      disableSelection(pic[0]);
      let enabled;
      pic.mousemove((e) => {
				// this is important, because it can stop Firefox itself drag event, or it will rotate once;
        pic[0].ondragstart = function () { return false; };

        pause();
				// set move range
        if (e.pageX <= pic.offset().left + options.resetMargin || e.pageX > pic.offset().left + pic.width() - options.resetMargin || e.pageY <= pic.offset().top + options.resetMargin || e.pageY >= pic.offset().top + pic.height() - options.resetMargin) {
          enabled = false;
          return false;
        }

        if (enabled == true) {
          pic.attr('src', imgArr[Math.floor((e.pageX - pic.offset().left) / (pic.width() / imgArr.length))]);
        }
      });

      pic.mouseup(() => {
        enabled = false;
      }).mousedown(() => {
        enabled = true;
      }).mouseout(() => {
        enabled = false;
      });

    }

		/**
		*	add other event
		*	if (options.method == "others") {...}
		*/
  });

	// forbid element be selected
  function disableSelection(element) {
    element.onselectstart = function () {
      return false;
    };
    element.unselectable = 'on';
    element.style.MozUserSelect = 'none';
    element.style.cursor = 'default';
  }


	// initialize tools
  function initTools(imgEle) {
    if (!imgEle) return false;
    const panoramaBox = $("<div class='panorama_box'><div class='image_box'></div></div>");
    imgEle.wrap(panoramaBox);

    // const toolsHtml = '<p class="toolbar"><span class="reset" title="恢复到最初"></span><span id="start" class="start" title="开始"></span><span class="zoomin"  title="放大"></span><span class="zoomout" title="缩小"></span><span class="turnleft" title="左转"></span><span class="turnright" title="右转"></span></p>';
    const toolsHtml = '<div class="imageBottomTxt"><img src="../images/3DImg/3dDisplayOne.png"/> 左右拖动图片，查看产品更多细节</div>';
    $('.image_box').after(toolsHtml);
    $('.image_box').width(originalWidth + 2).height(originalHeight);
    $('.panorama_box').width(originalWidth);

		// add Listener
    $('#start').click(function () {
      if ($(this).attr('title') == '开始') {
        start();
      } else {
        pause();
      }
    });

    $('.turnleft').click(() => {
      pause(1);
      autoPlay(_this, 'left');
    });

    $('.turnright').click(() => {
      pause(1);
      autoPlay(_this, 'right');
    });

    $('.reset').click(() => {
      reset();
    });

    $('.zoomin').click(() => {
      pause();
      zoom(_this, 'zoomin');
    });

    $('.zoomout').click(() => {
      pause();
      zoom(_this, 'zoomout');
    });

    $('.image_box').mousewheel((event, delta) => {
      pause();
      if (delta > 0) {
        zoom(_this, 'zoomin');
      } else if (delta < 0) {
        zoom(_this, 'zoomout');
      }
    });
  }

	// start
  function start() {
    $('#start').attr('title', '暂停');
    $('#start').removeClass('start').addClass('pause');
    isPause = false;
    autoPlay(_this, direction);
  }
	// pause
  function pause(args) {
    if (args) {
      $('#start').attr('title', '暂停');
      $('#start').removeClass('start').addClass('pause');
    } else {
      $('#start').attr('title', '开始');
      $('#start').removeClass('pause').addClass('start');
    }
    clearTimer();
  }

	// reset
  function reset() {
    isPause = false;
    isFirst = true;
    index = null;	// Picture Index
    direction = 'right'; // Default Direction
    defautLevel = 0;
    pause();
    _this.attr('src', options.images[0]);
    _this.animate({ left: 0, top: 0, height: `${originalHeight}px`, width: `${originalWidth}px` }, 250);
  }

	/**
	* auto play the pictures
	* @param imgEle:
	*	the original image,
	*	type: Array
	*
	* @param dire:
	*	rotate dire ,
	*	type : String,
	*	Eg : "left", "right"
	*/

  function autoPlay(imgEle, dire) {
    clearTimer();
    direction = dire || 'right'; // default direction is right.
    if (isFirst) {
      index = (direction == 'right' ? 0 : options.images.length - 1);
    }

    timer = setInterval(() => {
      if (isPause) { return; }

      imgEle.attr('src', options.images[index]);
      if	(direction == 'right') {
        index++;
        if (index >= options.images.length - 1) { index = 0; }
      } else {
        index--;
        if (index <= 0) { index = options.images.length - 1; }
      }
    }, options.speed);

    isFirst = false;
  }
	// stop rotate
  function clearTimer() {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  }

	/**
	*	image zoom effect
	*	@param imgEle
	*	@param mode,["zoomin", "zoomout"]
	*	return currentLevel
	*/
  function zoom(imgEle, mode) {
    let ratio,
      left,
      top;
    if (mode == 'zoomin') {
      defautLevel++;
      if (defautLevel >= options.zoomLevel[1] + 1) {
        defautLevel = options.zoomLevel[1];
        return;
      }
    } else {
      defautLevel--;
      if (defautLevel <= options.zoomLevel[0] - 1) {
        defautLevel = options.zoomLevel[0];
        return;
      }
    }

    ratio = 1 + defautLevel * options.scale;
    left = (originalWidth - originalWidth * ratio) / 2;
    top = (originalHeight - originalHeight * ratio) / 2;
    imgEle.animate({ left: `${left}px`, top: `${top}px`, height: `${originalHeight * ratio}px`, width: `${originalWidth * ratio}px` }, options.zoomSpeed);
    return defautLevel;
  }
};
