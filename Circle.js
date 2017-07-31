function Circle (pos, rad, vel, col, mass, e, rest) {
	this.pos = pos || createVector(random(100,1150),random(100,500));
	this.prevpos = createVector(this.pos.x, this.pos.y);
	this.rad = rad || random(2,2.5);
	this.vel = vel || p5.Vector.random2D();
	this.col = col || createVector(random(0,255),255,90);
	this.mass = mass || 2 * this.rad;
	this.invmass = 1/this.mass;
	this.elast = (e == null) ? 0.95 : e;
	this.typ = "Circle";
	this.movementRestricted = rest || false;
	this.accel = createVector(0,0);
	this.force = createVector(0,0);
	this.trail = [];
}

Circle.prototype.update = function() {
	if(!this.movementRestricted) {
		this.accel = this.force.mult(this.invmass);
		this.vel.add(this.accel);
		this.prevpos = createVector(this.pos.x, this.pos.y);
		this.pos.add(this.vel);
		this.force.mult(0);
		// trail effect
		//
	}
};

Circle.prototype.updateTrail = function() {
	this.trail.push(createVector(this.pos.x,this.pos.y));
		//if(this.trail.length > 15)
		//	this.trail.splice(0,1);
}

Circle.prototype.draw = function() {
	//stroke(15);
	fill(this.col.x,this.col.y,this.col.z);
	ellipse(this.pos.x,this.pos.y,2*this.rad,2*this.rad);
	//line(this.pos.x, this.pos.y, this.prevpos.x, this.prevpos.y);
	// trail effect		// NOTE :  we have found that trailing can just be acheived by continously drawing a backgorund with lesser alpha, its not perfect but does the simple job
					   // Also note that the combination of brightness and alpha is what does the trick, not alpha just alone
	//for (var i = 0; i < this.trail.length-1; i+=3) {
	//	noStroke();
	//	fill(this.col.x, this.col.y, this.col.z, 255*(i+1)/this.trail.length);
	//	ellipse(this.trail[i].x, this.trail[i].y, 2*(this.rad)*(i+1)/this.trail.length);
	//}
};

Circle.prototype.addForce = function(f) {
	this.force.add(f);
};

Circle.prototype.translate = function(d) {
	if(this.movementRestricted == false)
		this.pos.add(d);
};