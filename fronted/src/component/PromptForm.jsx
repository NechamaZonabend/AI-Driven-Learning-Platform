
import React, { useState, useEffect } from 'react';

import { getAllCategories, getAllSubCategories } from '../services/api';


const PromptPage = () => {

const [categories, setCategories] = useState([]);

const [subCategories, setSubCategories] = useState([]);

const [selectedCategory, setSelectedCategory] = useState('');

const [selectedSub, setSelectedSub] = useState('');


useEffect(() => {

// שליפת כל הקטגוריות מהשרת

const fetchCategories = async () => {

try {

const res = await getAllCategories();

setCategories(res.data || []);

} catch (err) {

setCategories([]);

}

};

fetchCategories();

}, []);


useEffect(() => {

// שליפת תתי קטגוריות לקטגוריה שנבחרה

if (selectedCategory) {

const fetchSubCategories = async () => {

try {

const res = await getAllSubCategories(selectedCategory);

setSubCategories(res.data || []);

} catch (err) {

setSubCategories([]);

}

};

fetchSubCategories();

} else {

setSubCategories([]);

}

setSelectedSub('');

}, [selectedCategory]);


const handleCategoryChange = (e) => {

setSelectedCategory(e.target.value);

};


const handleSubChange = (e) => {

setSelectedSub(e.target.value);

};


return (

<div>

<h2>בחר קטגוריה</h2>

<select value={selectedCategory} onChange={handleCategoryChange}>

<option value="">בחר...</option>

{categories.map((cat) => (

<option key={cat.id} value={cat.id}>{cat.name}</option>

))}

</select>

{selectedCategory && (

<>

<h3>בחר תת קטגוריה</h3>

<select value={selectedSub} onChange={handleSubChange}>

<option value="">בחר...</option>

{subCategories.map((sub) => (

<option key={sub.id} value={sub.id}>{sub.name}</option>

))}

</select>

</>

)}

</div>

);

};


export default PromptPage;