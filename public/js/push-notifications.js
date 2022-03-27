
//backend
    //push notifications


    const publicVapidKey = "BMkSdxhoT0fOiAGy_w4LswsXbSk1-qh3PSYL7nWI0hFMZjEMIytNN6Qo9GLB7sdF4AZ8Jalh5LDPNxIH_AVAY0o"
    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, "+")
          .replace(/_/g, "/");
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    if('serviceWorker' in navigator){
        send().catch(err => console.error(err));
    }
    async function send(){
        //register service worker
        const register = await navigator.serviceWorker.register('./worker.js', {
            scope: '/'
        });
        await navigator.serviceWorker.ready;
        //register push
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,

            //public vapid key
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
       
        //Send push notification
        await fetch("/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
                "content-type": "application/json"
            }
        });
    } 
