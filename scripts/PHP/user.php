<?php

/*
    [Description]---------------------------------------------------------------------------------------------------
	user.php = Implements the inner workings of client.php
   
	user.php, just like client.php holds two modes. Reflexive and
	non reflexive. 


    Class function Descriptions
=========================================================================================================
    -------------------------------------------[Previlage]----------------------------------------
    Description:
    Previlage class sorts of act like enum in C and C++, there are no special functions it can do
    aside from holding constant values that indicates something, but makes it wordy so it's easier to
    understand. 

    Note: Previlage is DIFFERENT from Position where position determines the rank of the user
    
    
=========================================================================================================
    -------------------------------------------[Fetch]--------------------------------------------
    Description:
    Fetch class specifies what type of behavior will certain functions from AccountManager undergo.
    By default all of them uses fetch.User value, which specifies that the fetching is done in User specific.
    Meaning that the fetching will depend on extra variables such as if the User has a previlage level of Root
    and etc.


*/
	
if (!defined('user_php_included')) {

    define('user_php_included', '');

    class previlage {

        const Invalid    = 0;
        const Normal     = 1;
        const Admin      = 2;
        const Root       = 3;
    }

    class fetch {

        const User       = 0;
        const All        = 1;
    }

    include('accman_definition.php');
	
}

?>