package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.dtos.CreateUpdatePostDto;
import com.example.pafbackendversionthree.dtos.UserPostDto;
import com.example.pafbackendversionthree.services.UserPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class UserPostController {

    @Autowired
    private UserPostService userPostService;

    // Create a new post
    @PostMapping
    public ResponseEntity<UserPostDto> createPost(@RequestParam String userId, @RequestBody CreateUpdatePostDto createUpdatePostDto) {
        UserPostDto createdPost = userPostService.createPost(userId, createUpdatePostDto);
        return ResponseEntity.ok(createdPost);
    }

    // Update an existing post
    @PutMapping("/{postId}")
    public ResponseEntity<UserPostDto> updatePost(@PathVariable String postId, @RequestBody CreateUpdatePostDto createUpdatePostDto) {
        UserPostDto updatedPost = userPostService.updatePost(postId, createUpdatePostDto);
        return ResponseEntity.ok(updatedPost);
    }

    // Delete a post by ID
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        userPostService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // Get a single post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<UserPostDto> getPostById(@PathVariable String postId) {
        UserPostDto post = userPostService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<List<UserPostDto>> getAllPosts() {
        List<UserPostDto> posts = userPostService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // Get posts by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserPostDto>> getPostsByUser(@PathVariable String userId) {
        List<UserPostDto> posts = userPostService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }
}