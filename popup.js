async function getPagesFromCategory(categoryUrl) {
    try {
      const response = await fetch(categoryUrl);
      const data = await response.json();
  
      if (data.query && data.query.categorymembers.length > 0) {
        return data.query.categorymembers;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error details:", error);
      return [];
    }
  }
  
  async function getRandomPage(categories) {
    const pages = await Promise.all(
      categories.map(async (categoryUrl) => {
        const categoryMembers = await getPagesFromCategory(categoryUrl);
        return categoryMembers.filter((member) => member.ns !== 14);
      })
    );
  
    const flattenedPages = pages.flat();
  
    if (flattenedPages.length > 0) {
      const randomIndex = Math.floor(Math.random() * flattenedPages.length);
      return flattenedPages[randomIndex].title;
    } else {
      throw new Error("No pages found in the selected categories.");
    }
  }
  
  document.getElementById("random-wiki-page").addEventListener("click", async () => {
    const categories = [
      "Category:Multinational_food_companies",
      "Category:Fast-food_chains_of_the_United_States",
      "Category:Amusement_parks_in_the_United_States",
      "Category:Tourist_attractions_in_the_United_States_by_city",
      "Category:Unusual_articles",
      "Categorie:Fastfoodketen",
      "Categorie:Attractiepark",
      "Categorie:Toeristische_attractie",
      "Categorie:Wikipedia:Etalageartikelen",
    ];
  
    const languages = [
      { code: "en", url: "https://en.wikipedia.org" },
      { code: "nl", url: "https://nl.wikipedia.org" },
    ];
  
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
  
    const categoryUrls = categories.map(
      (category) => `${randomLanguage.url}/w/api.php?action=query&list=categorymembers&cmtitle=${category}&format=json&cmlimit=100&origin=*`
    );
  
    try {
      const pageTitle = await getRandomPage(categoryUrls);
      const encodedPageTitle = encodeURIComponent(pageTitle);
      const pageUrl = `${randomLanguage.url}/wiki/${encodedPageTitle}`;
      window.open(pageUrl, "_blank");
    } catch (error) {
      console.error("Error details:", error);
      alert("An error occurred while fetching data. Check the console for more details.");
    }
  });
  