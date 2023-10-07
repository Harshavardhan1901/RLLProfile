import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public users: any = [];
  public role!: string;

  public fullName: string = "";
  public editMode = false;
  public editedUser: any = {}; // Store edited user data here

  constructor(
    private api: ApiService,
    private auth: AuthService, 
    private userStore: UserStoreService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.api.getUsers()
      .subscribe(res => {
        this.users = res;
      });

      // Check if the user is logged in
    // if (this.auth.isLoggedIn()) {
    //   // Fetch user details for the currently logged-in user
    //   this.auth.getUserDetails()
    //     .subscribe(userDetails => {
    //       this.User = userDetails;
    //     });
    // }

      // const uniqueName = sessionStorage.getItem("uniqueUser")
      // console.log(uniqueName)
      // this.api.getUsers()
      // .subscribe(res => {
      //   this.users = res;
      //   this.users=this.users.filter((user:any)=> (user.userName === uniqueName )) 
      //   console.log(this.users)
      // });

    this.userStore.getFullNameFromStore()
      .subscribe(val => {
        const fullNameFromToken = this.auth.getfullNameFromToken();
        this.fullName = val || fullNameFromToken;
      });

    this.userStore.getRoleFromStore()
      .subscribe(val => {
        const roleFromToken = this.auth.getRoleFromToken();
        this.role = val || roleFromToken;
      });
  }

  editUser(index: number) {
    this.editMode = true;
    this.editedUser = { ...this.users[index] };
  }

  saveChanges() {
    this.userService.updateUserDetails(this.editedUser)
      .subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          // Update the local data (users array) or other components if necessary
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating user details:', error);
          // Handle error as needed and provide user feedback
        }
      );
  }

  cancelEdit() {
    this.editMode = false;
  }

  logout() {
    this.auth.signOut();
  }
}
