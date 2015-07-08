var CONFIG = {
	TO_CC: "jp.co.orangesoft.GM_Checker.config.to_cc",
	CONFIRM_SENT: "jp.co.orangesoft.GM_Checker.config.confirm_sent",
	KEYWORD: "jp.co.orangesoft.GM_Checker.config.keywords",
	FORCE_BCC: "jp.co.orangesoft.GM_Checker.config.force_bcc",
	LICENSE:  "jp.co.orangesoft.GM_Checker.config.license",
	VERBOSE:  "jp.co.orangesoft.GM_Checker.config.verbose"
};

$(document).ready(function(){
	// 言語対応
	$('[data-i18n]').each(function(){
		var s = resStr(this.dataset.i18n);
		if (this.tagName == "INPUT") {
			this.value = s;
		} else {
			$(this).text(s);
		}
	});
	var opts = {};
	var upds = {};
	opts.tocc = localStorage.getItem(CONFIG.TO_CC) || 10;
	$("#to_cc").val(opts.tocc).on('change', function(){ upds.tocc = this.value; anyChanged(); });
	opts.confirm_sent = (localStorage.getItem(CONFIG.CONFIRM_SENT) == 'true');
	$("#confirm_sent").prop('checked', opts.confirm_sent).on('click', function() { upds.confirm_sent = this.checked; anyChanged(); });
	opts.keyword = localStorage.getItem(CONFIG.KEYWORD) || "";
	$('#keywords').val(opts.keyword).on('keyup', function() { upds.keyword = this.value; anyChanged(); });
	opts.force_bcc = localStorage.getItem(CONFIG.FORCE_BCC) || "";
	$('#force_bcc').val(opts.force_bcc).on('keyup', function() { upds.force_bcc = this.value; anyChanged(); });
	opts.verbose = (localStorage.getItem(CONFIG.VERBOSE) == 'true');
	$("#verbose").prop('checked', opts.verbose).on('click', function() { upds.verbose = this.checked; anyChanged(); });
	opts.license = localStorage.getItem(CONFIG.LICENSE) || "";
	// ライセンスチェック
	// ライセンスが有効なら入力エリアをreadonlyに
	$('#license').val(opts.license);
	if (!opts.license || !validateLicense(opts.license)) {
		$('#license').on('keyup', function() { upds.license = this.value; anyChanged(); });
		$('#activate').on("click", function(ev){
			var k = $('#license').val();
			if (validateLicense(k)) {
				localStorage.setItem(CONFIG.LICENSE, k);
			}
		});
	}
	$.extend(upds, opts);
	anyChanged();

	$('#apply').on("click", function(ev){
		localStorage.setItem(CONFIG.TO_CC, upds.tocc);
		localStorage.setItem(CONFIG.CONFIRM_SENT, upds.confirm_sent.toString());
		localStorage.setItem(CONFIG.KEYWORD, upds.keyword);
		localStorage.setItem(CONFIG.FORCE_BCC, upds.force_bcc);
		localStorage.setItem(CONFIG.VERBOSE, upds.verbose);
		$.extend(opts, upds);
		this.disabled = true;
		$('#tip').show().fadeOut(1000);
	});

	function anyChanged() {
		var changed = false;
		for (var key in opts) {
			if (opts[key] != upds[key]) { changed = true; }
		}
		$('#apply').prop('disabled', !changed);
	};

	function validateLicense(key) {
		var ok = Premium.validate(key);
		var res = Premium.result();
		if (ok) {
			$('#license').prop("readonly", true);
			$('#activate').prop("disabled", true);
			$('#activate').val(resStr("activated"));
			var s = resStr("licensePeriod")
					.replace("%Y", res.limit[0])
					.replace("%M", res.limit[1])
					.replace("%D", res.limit[2])
					.replace("%L", res.left);
			$('#leftdate').text(s);
			return true;
		} else {
			if (res.code == 4) {		// 期限切れ
				$('#leftdate').val("limit over");
			}
		}
		return false;
	};
});

