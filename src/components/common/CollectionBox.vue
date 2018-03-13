<template>
<div>
<!--collection modal-->
<div v-if="display === true" class="collect-modal">
    <div class="collect-popup">
        <div class="title">
            <span class="close" @click="notifyClose()">&times;</span>
            Add to My Collection
        </div>
        <ul class="collection-list" id="style-1">
            <li v-for="collection of collections" :key="collection.id" class="item">
                <div @click="gotoCollection(collection)" class="item-block">
                    <div class="entry-title">{{ collection.name }}</div>
                    <div class="entry-count">{{ collection.articles | number }}</div>
                </div>
                <div class="item-block right-side">
                    <button @click="addtoCollection(collection)" class="btn btn-collect">Add</button>
                </div>
            </li>
        </ul>
        <div class="action-box">
            <button @click="createNew()" class="btn btn-collect">Create New</button>
        </div>
    </div>
</div>
<!--end of collection modal-->
<!--create new collection modal-->
<div v-if="displayNew === true" class="collect-modal">
    <div class="collect-popup">
        <div class="title">
            <span class="close" @click="closeNew()">&times;</span>
            Create New Collection
        </div>
        <div class="collection-list">
            <div class="form-group" v-bind:class="{ formerror: $v.name.$error }">
                <input 
                    class="input" 
                    name="name" 
                    v-model.trim="name" 
                    @input="$v.name.$touch()" 
                    placeholder="collection title">
                <span class="form-message" v-if="!$v.name.required && $v.name.$dirty">collection name is required</span>
            </div>
            <div class="form-group">       
                <textarea
                    rows="4"
                    class="input" 
                    name="description" 
                    v-model.trim="description" 
                    placeholder="collection description (optional)"
                ></textarea>
            </div>
        </div>
        <div class="action-box">
            <button @click="processNew()" class="btn btn-collect">Create Now</button>
            <button @click="collectionModal()" class="btn btn-collect">Return</button>
        </div>
    </div>
</div>
</div>
<!--end of new collection modal -->
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

export default {
    mounted() {
        if(this.isLogin) {
            this.getCollections()
        }
    },
    props: [
        'display',
        'article'
    ],
	data () {
		return {
            collections: [],
            collection_id: '',
            number: 0,
            //display create new collection modal
            displayNew: false,
            name: '',
            description: ''
		}
    },
    validations: {
        name: {
            required,
            minLength: minLength(1)
        }
    },
    filters: {
        number(val) {
            return val.length
        }
    },
    computed: {
        ...mapGetters({
            isLogin: 'getState',
            userid: 'getID',
        }),
    },
    methods: {
        notifyClose() {
            this.$emit('close')
        },
        createNew() {
            this.$emit('close')
            this.displayNew = true
        },
        closeNew() {
            this.displayNew = false
        },
        collectionModal() {
            this.displayNew = false
            this.$emit('open')
        },
        getCollections() {
            this.$http.post('/c/collections', { owner: this.userid })
                .then(res => {
                    //console.log(res.data)
                    this.collections = res.data
                })
                .catch(err => {
                    console.log(err)
                })
        },
        gotoCollection(collection) {
            this.collection_id = collection._id
            this.$router.push('/mycollect/' + this.collection_id)
        },
        /*add article to collection*/
        addtoCollection(collection) {
            this.collection_id = collection._id
            var request = { 
                articleid: this.article,
                collectionid: this.collection_id
            }
            this.$http.post('/c/add', request)
                .then(res => {
                    if(res.data.success) {
                        //console.log(res)
                        this.getCollections()
                        this.displayNew = false
                        this.$notify({
                            type: 'success',
                            group: 'auth',
                            text: res.data.message
                        })
                    } else {
                        that.$notify({
                            type: 'warn',
                            group: 'auth',
                            text: res.data.message
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        /*create collection*/
        processNew() {
            var request = {
                userid: this.userid,
                name: this.name,
                description: this.description
            }
            this.$http.post('/c/collection', request)
                .then(res => {
                    //console.log(res)
                    if(res.data.success) {
                        this.$notify({
                            type: 'success',
                            group: 'auth',
                            text: res.data.message
                        })
                        this.getCollections()
                        this.displayNew = false
                    } else {
                        that.$notify({
                            type: 'warn',
                            group: 'auth',
                            text: res.data.message
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
	components: {
		
	}
}
</script>

<style lang="scss" scoped>
.collect-modal {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    justify-content: center;
    position: fixed;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.4);
    z-index: 500;
    .collect-popup {
        background-color: #fefefe;
        margin: 25% auto; 
        padding: 10px;
        border: 1px solid #888;
        width: 25%;
        max-width: 350px;
        border-radius: 10px;
        @media screen and (max-width: 420px) {
             width: 100%;
        } 
        .title {
            font-size: 1.167rem;
            font-weight: 700;
            line-height: 3;
            text-align: center;
            .close {
                color: #aaa;
                float: right;
                font-size: 24px;
                font-weight: bold;
                margin-top: -15px;
                height: 30px;
                &:hover {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
            }
        }
        .collection-list {
            overflow-y: auto;
            height: 15rem;
            border: 1px solid #eceeef;
            border-left: none;
            border-right: none;
            .item {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                padding: .5rem 1rem;
                border-bottom: 1px solid #eceeef;
                cursor: pointer;
                .right-side {
                    height: 100%;
                    float: right;
                    .btn-collect {
                        margin-top: 0;
                    }
                }
            }
        }
    }
}
/*scrollbar styling*/
#style-1::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 12px;
	background-color: #F5F5F5;
}

#style-1::-webkit-scrollbar
{
	width: 8px;
	background-color: #F5F5F5;
}

#style-1::-webkit-scrollbar-thumb
{
	border-radius: 12px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: lightgrey;
}

.entry-title {
    display: inline-block;
    font-size: 1.1rem;
    height: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.entry-count {
    display: inline-block;
    padding: .5em .5em;
    line-height: 1;
    text-align: center;
    color: #b9bec2;
    background-color: #f2f2f2;
    border-radius: 50%;
}
.thumb {
    width: 2.167rem;
    height: 2.167rem;
    border-radius: 2px;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
}
.btn-collect {
    margin-top: 8px;
    border: 1px solid lightgrey;
    color: lightgrey;
    background: #fff;
    &:hover {
        border-color: #00a1d6;
        color: #fff;
        background: #00a1d6;
    }
}
.form-group {
    font-size: 14px;
    background: #fff;
}
input, textarea {
    margin: 1rem 0;
    padding: 0.5rem;
    font-size: 1.2rem;
    font-family: inherit;
    line-height: 1.4;
    resize: none;
    outline: none;
    width: 100%;
    display: block;
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 2px;
    transition: border .3s;
    background-color: #fff;
    box-sizing: border-box;
}
</style>