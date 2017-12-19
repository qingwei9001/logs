/**
 * Created by shanguiren on 16/12/15.
 */
$("#id-add-org-1").change(function () {
    var org_id = $(this).val();
    var org_2_selector = $("#id-add-org-2");
    var org_3_selector = $("#id-add-org-3");
    org_3_selector.empty();
    org_3_selector.parent().addClass('hidden');
    if (org_id === '0') {
        org_2_selector.empty();
        org_2_selector.parent().addClass('hidden')
    } else {
        var org_level_map = $.parseJSON($("#id-org-level-map").val());
        var org_names = $.parseJSON($("#id-org-names").val());
        var is_empty = $.isEmptyObject(org_level_map[org_id]);
        org_2_selector.empty();
        if (is_empty) {
            org_2_selector.parent().addClass('hidden');
        } else {
            org_2_selector.append('<option value="0">二级机构</option>');
            $.each(org_level_map[org_id], function (k, v) {
                org_2_selector.append('<option value="' + k + '">' + org_names[k] + '</option>')
            });
            org_2_selector.parent().removeClass('hidden');
        }
    }

    var counter_selector = $("#id-account-counter");
    counter_linkage(counter_selector, org_id)
});

$("#id-add-org-2").change(function () {
    var org_1 = $("#id-add-org-1").val();
    var org_2 = $(this).val();
    var org_3_selector = $("#id-add-org-3");
    if (org_2 === '0' || org_2 === '-1') {
        org_3_selector.empty();
        org_3_selector.parent().addClass('hidden');
    } else {
        var org_level_map = $.parseJSON($("#id-org-level-map").val());
        var org_map = org_level_map[org_1][org_2];
        var is_empty = $.isEmptyObject(org_map);
        org_3_selector.empty();
        if (is_empty) {
            org_3_selector.parent().addClass('hidden');
        } else {
            org_3_selector.append('<option value="0">三级机构</option>');
            $.each(org_map, function (k, v) {
                org_3_selector.append('<option value="' + k + '">' + v + '</option>')
            });
            org_3_selector.parent().removeClass('hidden')
        }
    }

    var counter_selector = $("#id-account-counter");
    counter_linkage(counter_selector, org_2)
});

$("#id-add-org-3").change(function () {
    var org_id = $(this).val();
    var counter_selector = $("#id-account-counter");
    counter_linkage(counter_selector, org_id)
});

var choose_fields = function (ic_code) {
    var ic_codes = ['ecpic', 'epicc', 'pingan', 'gpic'];

    if ($.inArray(ic_code, ic_codes) !== -1) {
        $(".ecpic").hide();
        $(".epicc").hide();
        $(".pingan").hide();
        $(".gpic").hide();
        $(".other").hide();
        $("." + ic_code).show();
    } else {
        $(".ecpic").hide();
        $(".epicc").hide();
        $(".pingan").hide();
        $(".gpic").hide();
        $(".other").show();
    }
};


var ic_code = $("#add-form select[name='ic_code']").val();
choose_fields(ic_code);

$("#add-form select[name='ic_code']").change(function () {
    var ic_code = $(this).val();
    choose_fields(ic_code);
});

$("#task-app-account-add-btn").click(function (e) {
    e.preventDefault();

    var form = $("#add-form");
    var action = form.attr("action");
    var data = form.serialize();
    $.ajax({
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.success) {
                iAlert("操作成功!");
                setTimeout("location.reload();", 1000);
            } else {
                iAlert("操作失败! " + data['message']);
            }
        },
        error: function (xhr, textStatus, error) {
            if (xhr.status == 404) {
                iAlert("不存在或被删除!");
            } else if (xhr.status == 401) {
                iAlert("没有权限!");
            } else if (xhr.status == 500) {
                iAlert("系统错误!");
            }
        }
    });
});