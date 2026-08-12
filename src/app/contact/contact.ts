import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contact = {
    fullname: '',
    email: '',
    phoneNumber: '',
    position: '',
    message: '',
  };

  contacts: any[] = [];
  editIndex: number = -1;

  saveData() {
    if (
      this.contact.fullname.trim() === '' ||
      this.contact.email.trim() === '' ||
      this.contact.phoneNumber.trim() === '' ||
      this.contact.position.trim() === '' ||
      this.contact.message.trim() === ''
    ) {
      alert('Please enter your information.');
      return;
    }

    if (this.editIndex === -1) {
      this.contacts.push({
        ...this.contact,
      });

      alert('Your message has been sent to Vorng Sovannreach!');
    } else {
      // Update existing contact
      this.contacts[this.editIndex] = {
        ...this.contact,
      };

      alert('Updated successfully!');
      this.editIndex = -1;
    }

    // Clear form
    this.contact = {
      fullname: '',
      email: '',
      phoneNumber: '',
      position: '',
      message: '',
    };
  }

  editContact(index: number) {
    this.contact = {
      fullname: this.contacts[index].fullname,
      email: this.contacts[index].email,
      phoneNumber: this.contacts[index].phoneNumber,
      position: this.contacts[index].position,
      message: this.contacts[index].message,
    };
    this.editIndex = index;
  }

  deleteContact(index: number) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contacts.splice(index, 1);
      if(this.editIndex === index) {
        this.editIndex = -1;
      }
      alert('Contact deleted successfully!');
    }
  }
}
