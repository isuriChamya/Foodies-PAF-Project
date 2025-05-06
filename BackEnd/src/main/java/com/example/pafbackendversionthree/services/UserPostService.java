package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.CreateUpdatePostDto;
import com.example.pafbackendversionthree.dtos.UserPostDto;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.UserPost;
import com.example.pafbackendversionthree.repositories.UserPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserPostService {

    @Autowired
    private UserPostRepository userPostRepository;

    // Create a new post
    public UserPostDto createPost(String userId, CreateUpdatePostDto createUpdatePostDto) {
        AppUser appUser = new AppUser();
        appUser.setId(userId);

        UserPost post = new UserPost();
        post.setPostedBy(appUser);
        post.setTitle(createUpdatePostDto.getTitle());
        post.setDescription(createUpdatePostDto.getDescription());
        post.setMedias(
                createUpdatePostDto.getMedias().stream()
                        .map(media -> new UserPost.Media(media.getUrl(), media.getType()))
                        .collect(Collectors.toList())
        );

        UserPost savedPost = userPostRepository.save(post);
        return mapToDto(savedPost);
    }

    // Update an existing post
    public UserPostDto updatePost(String postId, CreateUpdatePostDto createUpdatePostDto) {
        Optional<UserPost> optionalPost = userPostRepository.findById(postId);
        if (optionalPost.isEmpty()) {
            throw new RuntimeException("Post not found with ID: " + postId);
        }

        UserPost post = optionalPost.get();
        post.setTitle(createUpdatePostDto.getTitle());
        post.setDescription(createUpdatePostDto.getDescription());
        post.setMedias(
                createUpdatePostDto.getMedias().stream()
                        .map(media -> new UserPost.Media(media.getUrl(), media.getType()))
                        .collect(Collectors.toList())
        );

        UserPost updatedPost = userPostRepository.save(post);
        return mapToDto(updatedPost);
    }

    // Delete a post by ID
    public void deletePost(String postId) {
        userPostRepository.deleteById(postId);
    }

    // Get a single post by ID
    public UserPostDto getPostById(String postId) {
        Optional<UserPost> optionalPost = userPostRepository.findById(postId);
        if (optionalPost.isEmpty()) {
            throw new RuntimeException("Post not found with ID: " + postId);
        }
        return mapToDto(optionalPost.get());
    }

    // Get all posts
    public List<UserPostDto> getAllPosts() {
        return userPostRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Get posts by a specific user
    public List<UserPostDto> getPostsByUser(String userId) {
        return userPostRepository.findByPostedById(userId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Map Entity to DTO
    private UserPostDto mapToDto(UserPost post) {
        UserPostDto.PostedBy postedBy = new UserPostDto.PostedBy(
                post.getPostedBy().getId(),
                post.getPostedBy().getFirstName(),
                post.getPostedBy().getLastName(),
                post.getPostedBy().getProfileImageUrl()
        );

        List<UserPostDto.Media> medias = post.getMedias().stream()
                .map(media -> new UserPostDto.Media(media.getUrl(), media.getType()))
                .collect(Collectors.toList());

        return new UserPostDto(
                post.getId(),
                postedBy,
                post.getPostedAt(),
                post.getTitle(),
                post.getDescription(),
                medias
        );
    }
}