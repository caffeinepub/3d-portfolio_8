import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SocialLink = {
    platform : Text;
    url : Text;
  };

  type Project = {
    id : Nat;
    title : Text;
    description : Text;
    link : Text;
  };

  type Portfolio = {
    name : Text;
    tagline : Text;
    about : Text;
    skills : [Text];
    socialLinks : [SocialLink];
  };

  type Resume = {
    fileName : Text;
    blob : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  module Project {
    public func compareById(project1 : Project, project2 : Project) : Order.Order {
      Nat.compare(project1.id, project2.id);
    };
  };

  module SocialLink {
    public func compareByPlatform(link1 : SocialLink, link2 : SocialLink) : Order.Order {
      Text.compare(link1.platform, link2.platform);
    };
  };

  let projects = Map.empty<Nat, Project>();
  var lastProjectId = 0;

  var portfolio : ?Portfolio = null;
  var resume : ?Resume = null;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Portfolio management functions
  public shared ({ caller }) func initializePortfolio(name : Text, tagline : Text, about : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize the portfolio");
    };
    portfolio := ?{
      name;
      tagline;
      about;
      skills = [];
      socialLinks = [];
    };
  };

  public shared ({ caller }) func updatePortfolio(name : Text, tagline : Text, about : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update the portfolio");
    };
    switch (portfolio) {
      case (null) { Runtime.trap("Portfolio not initialized") };
      case (?p) {
        portfolio := ?{
          p with
          name;
          tagline;
          about;
        };
      };
    };
  };

  public shared ({ caller }) func updateSkills(skills : [Text]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update skills");
    };
    switch (portfolio) {
      case (null) { Runtime.trap("Portfolio not initialized") };
      case (?p) {
        portfolio := ?{ p with skills };
      };
    };
  };

  public shared ({ caller }) func updateSocialLinks(links : [SocialLink]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update social links");
    };
    switch (portfolio) {
      case (null) { Runtime.trap("Portfolio not initialized") };
      case (?p) {
        portfolio := ?{ p with socialLinks = links.sort(SocialLink.compareByPlatform) };
      };
    };
  };

  // Project management functions
  public shared ({ caller }) func addProject(title : Text, description : Text, link : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add projects");
    };
    lastProjectId += 1;
    let project : Project = {
      id = lastProjectId;
      title;
      description;
      link;
    };
    projects.add(lastProjectId, project);
    lastProjectId;
  };

  public shared ({ caller }) func updateProject(id : Nat, title : Text, description : Text, link : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?_) {
        let updatedProject : Project = {
          id;
          title;
          description;
          link;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?_) {
        projects.remove(id);
      };
    };
  };

  // Resume management functions
  public shared ({ caller }) func uploadResume(fileName : Text, blob : Storage.ExternalBlob) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upload resume");
    };
    resume := ?{
      fileName;
      blob;
    };
  };

  // Public read functions (no authorization required - accessible to all including guests)
  public query func getPortfolio() : async Portfolio {
    switch (portfolio) {
      case (null) { Runtime.trap("Portfolio not found") };
      case (?p) { p };
    };
  };

  public query func getProjects() : async [Project] {
    projects.values().toArray().sort(Project.compareById);
  };

  public query func getResume() : async Resume {
    switch (resume) {
      case (null) { Runtime.trap("Resume not found") };
      case (?r) { r };
    };
  };
};
