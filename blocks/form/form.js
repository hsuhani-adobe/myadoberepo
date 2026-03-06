export default async function decorate(block) {
 
  const response = await fetch(block.querySelector('a').href);
  const json = await response.json();
 
  const form = document.createElement('form');
  form.classList.add('form');
 
  json.data.forEach((field) => {
 
    if (field.Type !== 'submit') {
 
      const label = document.createElement('label');
      label.textContent = field.Label;
 
      let input;
 
      if (field.Type === 'textarea') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = field.Type;
      }
 
      input.name = field.Name;
      input.placeholder = field.Placeholder || '';
 
      if (field.Required === 'true') {
        input.required = true;
      }
 
      form.appendChild(label);
      form.appendChild(input);
 
    } else {
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = field.Label;
      form.appendChild(button);
    }
 
  });
 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
 
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
 
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
 
      const result = await res.json();
      console.log('Response:', result);
 
      alert('Form submitted successfully!');
      form.reset();
 
    } catch (error) {
      alert('Submission failed!');
      console.error(error);
    }
  });
 
  block.textContent = '';
  block.appendChild(form);
}