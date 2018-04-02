import React, {Component} from 'react';
import './search.css';

class Search extends Component {

  render(){
    return (

        <div class="topnav">
  <div class="search-container">
    <form action="/action_page.php">
      <input type="text" placeholder="Search.." name="search"/>
      <button type="submit"><i class="fa fa-search"></i></button>
    </form>
  </div>
</div>


    );
  }
}
export default Search;
