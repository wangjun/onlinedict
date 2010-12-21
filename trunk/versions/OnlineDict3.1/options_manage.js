var Options =
{
    //"background_color": ["color", ""],
    //"links_color": ["color", ""],
    //"text_color": ["color", ""],
    "color_type":["color_type",0],
    "dict_disable": ["checked", false],
    "ctrl_only": ["checked", false],
    "english_only": ["checked", true]
};

function getColorType()
{
    //alert(document.all.back_color.length);
    for(var i=0;i<document.all.back_color.length;i++)
    {
        if (document.all.back_color[i].checked == true){ 
            return i;
        }
    }
}
function setColorType(iType)
{
    document.all.back_color[iType].checked = true;
}

function save_options()
{
    for (key in Options)
    {
        switch (Options[key][0])
        {
        case "color":
            Options[key][1] = "#" + document.getElementById(key).value;
            break;
        case "checked":
            Options[key][1] = document.getElementById(key).checked;
            break;
        case "color_type":
            Options[key][1] = getColorType();
            break;
        }

    }
    localStorage["ColorOptions"] = JSON.stringify(Options);
    var status = document.getElementById("save_status");
    status.innerHTML = "选项已保存。";
}

function restore_options()
{
    var localOptions = JSON.parse(localStorage["ColorOptions"]);
    //alert(localStorage["ColorOptions"]);
    //alert(localOptions["color_type"][1]);
    setColorType(localOptions["color_type"][1]);
    for (key in localOptions)
    {
        optionValue = localOptions[key];
        if (!optionValue) return;
        var element = document.getElementById(key);
        if (element)
        {
            element.value = localOptions[key][1];
            switch (localOptions[key][0])
            {
            case "checked":
                if (localOptions[key][1]) element.checked = true;
                else element.checked = false;
                break;
            }
        }
    }
    
}