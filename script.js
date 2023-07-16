document.addEventListener('DOMContentLoaded', () => {
   const searchWrapper = document.querySelector('.search');
   const searchInput = searchWrapper.querySelector('.search__input');
   const requestBox = searchWrapper.querySelector('.search__autocomplete-box');

   async function searchRepo(keyword) {
      try {
         const response = await fetch(`https://api.github.com/search/repositories?q=${keyword}`);
         if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
         }
         const data = await response.json();
         return data.items;
      } catch (error) {
         console.log(error);
      }
   }

   function showRequests(requests) {
      requestBox.innerHTML = '';
      if (!requests.length) {
         const noUser = document.createElement('li');
         noUser.classList.add('search__empty');
         noUser.textContent = 'Такого репозитория не существует';
         requestBox.append(noUser);
      }
      requests.slice(0, 5).forEach(request => {
         const item = document.createElement('li');
         item.classList.add('search__autocomplete-item');
         item.textContent = request.name;
         item.addEventListener('click', () => {
            const usersList = document.querySelector('.users-list');
            usersList.append(addRepo(request));
            searchInput.value = '';
            requestBox.style.display = 'none';
         })
         requestBox.append(item);
      })

      requestBox.style.display = 'block';
   }

   function addRepo(repo) {
      const userListItem = document.createElement('li');
      userListItem.classList.add('users-list__user')
      const userInfo = document.createElement('div');
      userInfo.insertAdjacentHTML('afterbegin', `<p>Name: ${repo.name}</p>
                                                <p>Owner: ${repo.owner.login}</p>
                                                <p>Stars: ${repo.stargazers_count}</p>`
      );
      const deleteButton = document.createElement('button');
      deleteButton.addEventListener('click', () => {
         userListItem.remove();
      });
      userListItem.append(userInfo);
      userListItem.append(deleteButton);
      return userListItem;
   }

   function debounce(func, delay) {
      let timer;
      return function (...args) {
         clearTimeout(timer);
         timer = setTimeout(() => {
            func.apply(this, args);
         }, delay);
      };
   }

   const handleInputChange = debounce(async function (e) {
      const keyword = e.target.value.trim();
      if (keyword === '') {
         requestBox.style.display = 'none';
         return;
      }
      const requests = await searchRepo(keyword);
      showRequests(requests);
   }, 500);

   searchInput.addEventListener('input', handleInputChange);
});




