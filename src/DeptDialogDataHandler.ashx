<%@ WebHandler Language="C#" Class="DeptDialogDataHandler" %>

using System;
using System.Web;
using Newtonsoft.Json;

/// <summary>
/// Ajax Data Handler.
/// Author: https://github.com/harveyhang
/// Tips：Modify code to apply your own business...
/// </summary>
public class DeptDialogDataHandler : IHttpHandler {
    public void ProcessRequest (HttpContext context) {
        //static data for test,this is the depts data...
        var depts = new[]{ 
            new {deptId = 0, deptName = "All Depts", parentDeptId = -1 },
            new {deptId = 1, deptName = "Technology Dept", parentDeptId = 0 },
            new {deptId = 2, deptName = "Software Dept", parentDeptId = 1 },
            new {deptId = 3, deptName = "Hardware Dept", parentDeptId = 1 },
            new {deptId = 4, deptName = "Human Resource Dept", parentDeptId = 0 } 
        };
        //convert data type to ztree 
        //... convert process is omitted
        /**
         * data convert instruction:
         * the previous code section has three common properties:deptId,deptName,parentDeptId ,
         * which was converted to these properties under:        id    ,name    ,pId
         * if department node has child,set isParent=true;else,set isParent=false;
         **/
        var zTreeDepts = new[] { 
            new {id = 0, name = "All Depts", pId = -1, isParent=true },
            new {id = 1, name = "Technology Dept", pId = 0, isParent=true },
            new {id = 2, name = "Software Dept", pId = 1, isParent=false },
            new {id = 3, name = "Hardware Dept", pId = 1, isParent=false },
            new {id = 4, name = "Human Resource Dept", pId = 0, isParent=false } 
        };
        
        try
        {
            string ajaxMethod = context.Request["ajaxMethod"].ToString();//get ajax method
            System.Reflection.MethodInfo method = this.GetType().GetMethod(ajaxMethod);
            if (method != null)
                method.Invoke(this, new object[] { context });//execute method
        }
        catch (Exception)
        {
            throw;
        }
        finally
        {
            context.Response.End();
        }
    }
 
    /// <summary>
    /// async load children
    /// </summary>
    /// <param name="context"></param>
    public void AsyncCurrentNodeChildren(HttpContext context)
    {
        try
        {
            int id = int.Parse(context.Request.Params["id"]);
            var childrenData = new[] { 
                new {id = 1, name = "Technology Dept", pId = 0, isParent=true },
                new {id = 4, name = "Human Resource Dept", pId = 0, isParent=false } 
            };
            switch(id)
            {//suppose the data was getted
                case 0:
                    break;
                case 1:
                    childrenData = new[] { 
                        new {id = 2, name = "Software Dept", pId = 1, isParent=false },
                        new {id = 3, name = "Hardware Dept", pId = 1, isParent=false }
                    };
                    break;
                case 2:
                case 3:
                case 4:
                    childrenData = null;
                    break;
            }
            context.Response.Write(JsonConvert.SerializeObject(childrenData));
        }
        catch (Exception)
        {
            throw;
        }
    }
    
    /// <summary>
    /// root data
    /// </summary>
    /// <param name="context"></param>
    public void GetRootData(HttpContext context)
    {
        try
        {
            //suppose the data was getted
            var root = new { id = 0, name = "All Depts", pId = -1, isParent = true };
            context.Response.Write(JsonConvert.SerializeObject(root));
        }
        catch (Exception)
        {
            throw;
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}