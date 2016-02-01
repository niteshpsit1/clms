/**
  * Validation rules
  *
  * Author     : Aruljothi Parthiban
  * Created At : 22/12/2015
 **/
var _ = require('lodash');

var validationRules = {
	people: [
		{
			name: "idnumber",
			message: "ID Number is required !",
			type: "required"
		},
		{
			name: "name",
			message: "Name is required !",
			type: "required"
		},
		{
			name: "dba",
			message: "DBA is required !",
			type: "required"
		},
		{
			name: "data_phone",
			message: "Phone No is required !",
			type: "required"
		},
		{
			name: "data_email",
			message: "Email is required !",
			type: "required",
			next : [{
               	name: "data_email",
                message: "Please enter valid email !",
                type: "email"
           	}]
		},
		{
			name: "data_password",
			message: "Password No is required !",
			type: "required"
		}
	]
};

function validator(){
	this.errors = [];
	this.key = null;
	this.validationHandlers = [];
	this.model = {};
	this.isClient = false;
}

validator.prototype.getValue = function(model,fieldName){
	var parts = fieldName.split('_');
    if(parts.length>1){
      for(var index=0;index<parts.length-1;index++){
        model = model[parts[index]];
      }
      var lastPart = parts[parts.length-1];
      return model[lastPart];
    }
    else{
      return model[parts[0]];
    }
}

validator.prototype.required = function(rule){
	var value = this.getValue(this.model,rule.name);
   	if (!value || value === '' || value==='0') {
    	this.addError(rule);
	}
	else {
       	this.removeError(rule);           
	}
}

validator.prototype.email = function(rule){
	var value = this.getValue(this.model,rule.name);
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!re.test(value)) {
        this.addError(rule);
    }
    else {
        this.removeError(rule);
    }
}

validator.prototype.onlyString = function(rule){
	var re = /^[a-zA-Z ]+$/i;
	var value = this.getValue(this.model,rule.name);
    if (!re.test(value)) {
        this.addError(rule);
    }
    else {
        this.removeError(rule);
    }
}

validator.prototype.nextRule = function(rule){
	if(!rule.ruleId){
		rule.ruleId = this.getNewRoleId();
	}
	this[rule.type](rule);
}
validator.prototype.addError = function(rule){
	var oldError = _.find(this.errors,function(e){
		return e.ruleId === rule.ruleId;
	});
	if(!oldError){
		this.errors.push({
			message : rule.message,
			name : rule.name,
			validator : rule.type,
			ruleId : rule.ruleId
		});
	}
}

validator.prototype.removeError = function(rule){
	var self = this;
	var errors = _.filter(this.errors,function(e){
		return e.ruleId !== rule.ruleId;
	});
	this.errors = errors;

	// if it is valid
	// call next handlers
	if (rule.next && rule.next.length > 0) {
        _.forEach(rule.next, function (n) {
        	self.nextRule(n);
        });
   	}
}
validator.prototype.getNewRoleId = function(){
	var id = this.key+'_Rule_';
	id += _.random(1,10000000);
	return id;
}

validator.prototype.loadRules = function(){
	var _this = this;
	var rules = validationRules[this.key];
	_.forEach(rules,function(rule){
		rule.ruleId = _this.getNewRoleId();
		_this.validationHandlers.push(function(){
			_this[rule.type](rule);

			// if it is called in client side
			// enable call the handler in on change event
			if(_this.isClient){
				$('#' + rule.name).on('change', function (e) {
	                _this.model[rule.name] = e.target.value;
	                _this[rule.type](rule);
	                _this.isValidRule(rule);
	            });
			}
		});
	});
	return this;
}

validator.prototype.isValid = function(key,model,isClient){
	// initialize
	this.errors = [];
	this.key = key;
	this.model = model;
	this.isClient = isClient || false;

	var _this = this;
	if(this.validationHandlers.length===0){
		this.loadRules();
	}
	_.forEach(this.validationHandlers,function(validate){
		validate();
	});
	// if this called in client side
	// display error messages
	if(this.isClient){
		this.displayErrors();
	}
	// if there is no errors then the model is valid
	return this.errors.length===0;
}

validator.prototype.isValidRule = function(rule){
	var _this = this;
	_.forEach(this.validationHandlers,function(validate){
		validate();
	});
	// if this called in client side
	// display error messages
	if(this.isClient){
		this.displayErrors(rule);
	}
}

validator.prototype.displayErrors = function(currentExecutingRule){
	var errors = this.errors;
	var index = 0;
	var fields = [];
	_.forEach(errors,function(error){
		fields.push(error.name);
		var control = $('#' + error.name + '_error');	
		control.html(error.message);
        control.parents('.form-group').addClass('has-error');
        
        // set focus
        // if current rule is executing and it is not valid
        // then set focus to that element
    	if(index===0){
    		if(currentExecutingRule){
	        	if(error.ruleId ===currentExecutingRule.ruleId){
	        		$('#' + currentExecutingRule.name).focus();
	        	}
    		}
    		else{
    			$('#' + error.name).focus();
    		}
    	}
        index++;
	});
	// remove existing errors
	_.forOwn(this.model,function(value,key){
		var keyExist = _.find(fields,function(k){
			return k === key;
		})
		if(!keyExist){
			var control = $('#' + key + '_error');
            control.empty();
            control.parents('.form-group').removeClass('has-error');
		}
	});
}

module.exports = new validator();