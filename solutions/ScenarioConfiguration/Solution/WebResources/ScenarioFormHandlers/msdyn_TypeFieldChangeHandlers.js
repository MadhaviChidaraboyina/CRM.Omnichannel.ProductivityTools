function showTemplates(context)
{
    if(context._formContext!=null && context._formContext.getAttribute("msdyn_type")!=null)
    {
        if(context._formContext.getAttribute("msdyn_type").getValue() == true)
        {
        context._formContext.getControl("msdyn_sessiontemplate").setVisible(false);
        context._formContext.getControl("msdyn_notificationtemplate").setVisible(true);
        }
        else{
        context._formContext.getControl("msdyn_notificationtemplate").setVisible(false);
        context._formContext.getControl("msdyn_sessiontemplate").setVisible(true);
        }
    }
}

function showTemplatesOnFormLoad(context) {
    if (context._formContext != null && context._formContext.getAttribute("msdyn_type") != null) {
        if (context._formContext.getAttribute("msdyn_type").getValue() == true) {
            context._formContext.getControl("msdyn_sessiontemplate").setVisible(false);
            context._formContext.getControl("msdyn_notificationtemplate").setVisible(true);
        }
        else {
            context._formContext.getControl("msdyn_notificationtemplate").setVisible(false);
            context._formContext.getControl("msdyn_sessiontemplate").setVisible(true);
        }
    }
}

