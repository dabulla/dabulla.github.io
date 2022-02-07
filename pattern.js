/* 
 */

function pattern(canvas) {
	this.priority = 2500;
	var ctx;
	var lasttime = Date.now();
	var width = 350, height = 350;
	var pentagonWidthFactor=1.7320508075688774; // 2*sin(1/6*Math.PI*2);
	var requestFrame;
	/*
	 * Draw and update
	 */
	var run = function() {
		var now = Date.now();
		var tickcount = now - lasttime;
		lasttime = now;
		draw(tickcount);
		requestFrame();
	}

	var anim = 0;
	function draw(tc) {
		anim+=tc*0.0005;
		//ctx.clearRect(0,0,canvas.width, canvas.height);
		//ctx.fillRect(0, 0, canvas.width, canvas.height);
		canvas.width = canvas.width;
		//ctx.fillStyle = "rgb(0,0,0)";
		//ctx.font = 'bold 80px sans-serif';
		ctx.save(); // 1 Schrift. bottom=0, top=-height
		ctx.setTransform(1,0,0,1,0,height);
		ctx.save(); // 2 natural Space. bottom=0, top=height
		ctx.scale(1,-1);

		//ctx.shadowOffsetX = 0;
		//ctx.shadowOffsetY = 0;
		ctx.shadowBlur    = 4;
		ctx.shadowColor   = 'rgb(0, 0, 0)';
		drawMesh(20, globalWave);
		//drawParticle(0, 20);
			
		ctx.restore(); // 2
		//ctx.fillText("fps: "+Math.floor(1000/tc), -170, 0);
		ctx.restore(); // 1
	}
	var particles = [];
	function drawParticle(i, pentagonRadius) {
		if(!particles[i]) {
			var rand = Math.random()<0.5?0:1;
			particles[i] = {
				x:Math.random()*rand, 
				y:Math.random()*(1-rand), 
				xdir:Math.random()*0.01, 
				ydir:Math.random()*0.01
				};
		}
		var myx = Math.floor(particles[i].x);
		var myy = Math.floor(particles[i].y);
		var finxdir = particles[i].xdir>0?-1:1;
		var finydir = particles[i].ydir>0?-1:1;
		var lerp;
		if(Math.abs(particles[i].xdir)>Math.abs(particles[i].ydir)) {
			lerp = particles[i].x%1;
			drawPentagonInMesh(20, myx, myy, lerp);
			drawPentagonInMesh(20, myx+finxdir, myy, 1-lerp);
			particles[i].x += particles[i].xdir;
			if(lerp >0.99) {
				particles[i].ydir +=finydir*0.1;
				particles[i].xdir -=finxdir*0.1;
			}
		} else {
			lerp = particles[i].y%1;
			drawPentagonInMesh(20, myx, myy, lerp);
			drawPentagonInMesh(20, myx, myy+finydir, 1-lerp);
			particles[i].y += particles[i].ydir;
			if(lerp >0.99) {
				particles[i].ydir -=finydir*0.1;
				particles[i].xdir +=finxdir*0.1;
			}
		}

		if(particles[i].x<=0 && particles[i].xdir<0) {
			particles[i].x=0;
			particles[i].xdir = Math.abs(particles[i].xdir);
		} else if(particles[i].x>=width/(pentagonRadius*pentagonWidthFactor) && particles[i].xdir>0) {
			particles[i].x=0;
			particles[i].xdir = -Math.abs(particles[i].xdir);
		}
		if(particles[i].y<=0 && particles[i].ydir<0) {
			particles[i].y=0;
			particles[i].ydir = Math.abs(particles[i].ydir);
		} else if(particles[i].y<=height/(pentagonRadius*2) && particles[i].ydir>0) {
			particles[i].y=0;
			particles[i].ydir = -Math.abs(particles[i].ydir);
		}
		
		
	}
	function drawPentagonInMesh(pentagonRadius, i, j, intensity) {
		var x = i*pentagonRadius*2+((j+1)%2)*pentagonRadius;
		var y = j*pentagonRadius*pentagonWidthFactor;
		var grey = Math.floor(255-intensity*255);
		ctx.fillStyle = "rgba("+grey+","+grey+","+grey+","+Math.round(Math.sin(intensity*2)*10000)*0.0001+")";
		transformAndDraw(x, y, pentagonRadius, pentagonRadius, drawPentagon);
	}
	function drawMesh(pentagonRadius, fn) {
		var startMultiplicator = Math.cos(Math.max(Math.min(((anim*50-10)/100), 1),0)*Math.PI-Math.PI)*0.5+0.5;
		var x=0,y=0;
		var allowedHeight = (height-pentagonRadius)*startMultiplicator;
		var allowedWidth = width+pentagonRadius;
		var oneOverWidth = 1./allowedWidth;
		var oneOverHeight = 1./allowedHeight;
		for(var j=1; y < allowedHeight; ++j) {
			x = (j%2)*pentagonRadius;
			for(var i=1; x <= allowedWidth; ++i) {
				var intensity = fn(x*oneOverWidth, y*oneOverHeight, anim, startMultiplicator);
				if( intensity > 0.00) {
					var grey = Math.floor(255-intensity*233);
					//ctx.fillStyle = "rgba("+grey+","+grey+","+grey+","+Math.round(Math.sin(intensity*2)*10000)*0.0001+")";
					var grd = ctx.createLinearGradient(-0.8, 1, 1, -0.8);
					grd.addColorStop(0.3, "rgba("+grey+","+grey+","+grey+","+Math.round(Math.sin(intensity*2)*10000)*0.0001+")");
					grey -= 22;
					grd.addColorStop(0.7, "rgba("+grey+","+grey+","+grey+","+Math.round(Math.sin(intensity*2)*10000)*0.0001+")");
					ctx.fillStyle = grd;
					//ctx.shadowBlur    = 8-intensity*4;
					transformAndDraw(x, y, pentagonRadius, pentagonRadius, drawPentagonFast);
				//drawPentagonSWTransformFast(x, y, pentagonRadius);
				}
				x = i*pentagonRadius*2+(j%2)*pentagonRadius;
			}
			y = j*pentagonRadius*pentagonWidthFactor;
		}
	}
	function globalWave(x,y, anim, startMultiplicator) {
		return -Math.pow((heightProfile(x, y, anim)-y)*startMultiplicator-1, 2)+1;
	}
	function myFastSinInterpol(x) {
		x%=3.141592653589793;
		return (Math.pow(x,9)/362880-Math.pow(x,7)/5040+Math.pow(x,5)/120-Math.pow(x,3)/6+x/1);
	}
	function intensifyDot(i, j, x1, y1, dirx, diry, lerp) {
		if(i==x1+dirx||j==y1+diry) {
			return 1-lerp
		} else if(i==x1||j==y1) {
			return lerp;
		} else return 0;
	}
	function heightProfile(x, y, anim) {
		return ((Math.pow((x-0.5)*1.8,2)*4-3+Math.cos(x*2+anim))*0.25+0.5)*Math.min(1,(1-y)*3);
		var amp = myFastSinInterpol(anim*1.2323);
		var para = Math.pow((x-0.5),2)*5;
		return para*myFastSinInterpol(x*8+anim)*amp+myFastSinInterpol(x+anim)*(1-amp);
		return para;
	}
	
	function transformAndDraw(x, y, sx, sy, fn) {
		ctx.save();
		ctx.translate(x, y);
		ctx.scale(sx, sy);
		fn();
		ctx.restore();
	}
	function init() {
		if (navigator.appName.indexOf("Microsoft")!=-1) {
			width = window.innerWidth;
		//height = window.innerHeight;
		} else if (window.innerWidth) {
			width = window.innerWidth;
		//height = window.innerHeight;
		} else if (document.body && document.body.offsetWidth) {
			width = document.body.offsetWidth;
		//height = document.body.offsetHeight;
		} else if(document.width) {
			width = document.width;
		}
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		
	}
	if(canvas.getContext) {
		ctx = canvas.getContext('2d');
		init();
		window.addEventListener("resize",init, true);
		
		
		if(window.requestAnimationFrame) {
			requestFrame = function() {
				window.requestAnimationFrame(run);
			};
			requestFrame();
		} else if(window.msRequestAnimationFrame) {
			requestFrame = function() {
				window.msRequestAnimationFrame(run);
			};
			requestFrame();
		} else if(window.mozRequestAnimationFrame) {
			requestFrame = function() {
				window.mozRequestAnimationFrame(run);
			};
			requestFrame();
		} else if(window.webkitRequestAnimationFrame) {
			requestFrame = function() {
				window.webkitRequestAnimationFrame(run, canvas);
			};
			requestFrame();
		} else {
			requestFrame = function() {};
			setInterval(run, 20);
		}
		
	}
	function drawPentagon() {
		ctx.beginPath();
		ctx.moveTo(0, 1);
		var corners = 6;
		var fullCircle = Math.PI*2;
		var arc;
		for(var i=1 ; i<=corners ; ++i) {
			arc = i/corners*fullCircle;
			ctx.lineTo(Math.sin(arc), Math.cos(arc));
		}
		//ctx.stroke();
		ctx.fill();
	}
	function drawPentagonFast() {
		ctx.beginPath();
		ctx.moveTo(0, 1);
		ctx.lineTo(0.8660254037844386, 0.5);
		ctx.lineTo(0.8660254037844387, -0.5);
		ctx.lineTo(0, -1);
		ctx.lineTo(-0.8660254037844384, -0.5);
		ctx.lineTo(-0.8660254037844386, 0.5);
		ctx.lineTo(0, 1);
		//ctx.stroke();
		ctx.fill();
	}
	function drawPentagonSWTransformFast(x, y, s) {
		ctx.beginPath();
		var var1 = 0.8660254037844386*s;
		var var2 = 0.5*s;
		ctx.moveTo(x, y+s);
		ctx.lineTo(x+var1, y+var2);
		ctx.lineTo(x+var1, y-var2);
		ctx.lineTo(x, y-s);
		ctx.lineTo(x-var1, y-var2);
		ctx.lineTo(x-var1, y+var2);
		ctx.lineTo(x, y+s);
		//ctx.stroke();
		ctx.fill();
	}
}