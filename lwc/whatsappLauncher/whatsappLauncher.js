import { LightningElement,api,wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import sendMsg from '@salesforce/apex/whatsappController.sendMessage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const fields = [PHONE_FIELD];

export default class WhatsappLauncher extends LightningElement {
    @api recordId;

    whatsappMsg ='';
    phoneNumber ='';
    samplePhone ='REPLACE_WITH_PHONE_NUMBER_ID';
    accessKey ='REPLACE_WITH_ACCESS_TOKEN';
    _title = 'Sample Title';
    message = 'Sample Message';
    variant = 'error';
    variantOptions = [
        { label: 'error', value: 'error' },
        { label: 'warning', value: 'warning' },
        { label: 'success', value: 'success' },
        { label: 'info', value: 'info' },
    ];


    @wire(getRecord,{recordId:'$recordId', fields })
    account;

    get getphone() {
        this.phoneNumber = getFieldValue(this.account.data, PHONE_FIELD);
        return getFieldValue(this.account.data, PHONE_FIELD);
    }

    sendMessage(){
        sendMsg({message:this.whatsappMsg,phoneNumber:this.phoneNumber,accessKey:this.accessKey,
            samplePhone:this.samplePhone}).then(result=>{
            console.log('Final Response ==> ' + result);
            if(result =='Success'){
                this._title ="Success";
                this.message="Message Sent Successfully..!";
                this.variant="success";
                this.showNotification();
                this.clearField();
            }
            else{
                this._title ="Error";
                this.message="Message Sent Failed..!";
                this.variant="error";
                this.showNotification();
                this.clearField();
            }
        })
    }

    showNotification() {
        const evt = new ShowToastEvent({
            title: this._title,
            message: this.message,
            variant: this.variant,
        });
        this.dispatchEvent(evt);
    }

    clearField(){
        this.whatsappMsg='';
        this.phoneNumber='';
    }

    onWhatsappMsg(event){
        this.whatsappMsg=event.target.value;
    }

}