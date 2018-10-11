let helper = {
	pad0: function(value, size) {
		value += '';
		while (value.length < size) {
			value = '0' + value;
		}

		return value;
	}
};

export default helper;